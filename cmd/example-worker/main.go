package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/hibiken/asynq"
)

const (
	typeEmail  = "demo:email"
	typeReport = "demo:report"
	typeFail   = "demo:fail"

	taskRetention = 24 * time.Hour
)

type emailPayload struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
}

type reportPayload struct {
	Name string `json:"name"`
}

func main() {
	redisAddr := flag.String("redis-addr", "127.0.0.1:6379", "address of redis server to connect to")
	flag.Parse()

	redisOpt := asynq.RedisClientOpt{Addr: *redisAddr}

	client := asynq.NewClient(redisOpt)
	defer client.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go enqueueLoop(ctx, client)

	srv := asynq.NewServer(redisOpt, asynq.Config{
		Concurrency: 5,
		Queues: map[string]int{
			"critical": 6,
			"default":  3,
			"low":      1,
		},
	})

	mux := asynq.NewServeMux()
	mux.HandleFunc(typeEmail, handleEmail)
	mux.HandleFunc(typeReport, handleReport)
	mux.HandleFunc(typeFail, handleFail)

	log.Printf("example worker listening on redis %s", *redisAddr)
	if err := srv.Run(mux); err != nil {
		log.Fatalf("worker stopped: %v", err)
	}
}

func enqueueLoop(ctx context.Context, client *asynq.Client) {
	enqueueExamples(client)

	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			enqueueExamples(client)
		}
	}
}

func enqueueExamples(client *asynq.Client) {
	n := time.Now().Unix() % 1000

	emailTask, err := newEmailTask(fmt.Sprintf("user%d@example.com", n), "Welcome!")
	if err != nil {
		log.Printf("create email task: %v", err)
		return
	}
	if info, err := client.Enqueue(emailTask, asynq.Queue("critical"), asynq.Retention(taskRetention)); err != nil {
		log.Printf("enqueue email: %v", err)
	} else {
		log.Printf("enqueued %s id=%s queue=%s", typeEmail, info.ID, info.Queue)
	}

	reportTask, err := newReportTask(fmt.Sprintf("daily-report-%d", n))
	if err != nil {
		log.Printf("create report task: %v", err)
		return
	}
	if info, err := client.Enqueue(reportTask, asynq.Retention(taskRetention)); err != nil {
		log.Printf("enqueue report: %v", err)
	} else {
		log.Printf("enqueued %s id=%s queue=%s", typeReport, info.ID, info.Queue)
	}

	failTask := asynq.NewTask(typeFail, []byte(`{"attempt":"demo"}`))
	if info, err := client.Enqueue(failTask, asynq.Queue("low"), asynq.MaxRetry(3), asynq.Retention(taskRetention)); err != nil {
		log.Printf("enqueue fail: %v", err)
	} else {
		log.Printf("enqueued %s id=%s queue=%s", typeFail, info.ID, info.Queue)
	}

	delayed, err := newReportTask(fmt.Sprintf("delayed-report-%d", n))
	if err != nil {
		log.Printf("create delayed task: %v", err)
		return
	}
	if info, err := client.Enqueue(delayed, asynq.ProcessIn(30*time.Second), asynq.Queue("low"), asynq.Retention(taskRetention)); err != nil {
		log.Printf("enqueue delayed: %v", err)
	} else {
		log.Printf("scheduled %s id=%s in 30s", typeReport, info.ID)
	}
}

func newEmailTask(to, subject string) (*asynq.Task, error) {
	payload, err := json.Marshal(emailPayload{To: to, Subject: subject})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(typeEmail, payload), nil
}

func newReportTask(name string) (*asynq.Task, error) {
	payload, err := json.Marshal(reportPayload{Name: name})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(typeReport, payload), nil
}

func handleEmail(ctx context.Context, t *asynq.Task) error {
	var p emailPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("bad email payload: %w", err)
	}
	time.Sleep(200 * time.Millisecond)
	log.Printf("sent email to=%s subject=%q", p.To, p.Subject)
	return nil
}

func handleReport(ctx context.Context, t *asynq.Task) error {
	var p reportPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("bad report payload: %w", err)
	}
	time.Sleep(500 * time.Millisecond)
	log.Printf("generated report name=%s", p.Name)
	return nil
}

func handleFail(ctx context.Context, t *asynq.Task) error {
	if rand.Intn(2) == 0 {
		return fmt.Errorf("simulated failure for demo")
	}
	log.Printf("fail task recovered payload=%s", string(t.Payload()))
	return nil
}
