package main

import (
	"time"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - internal types with JSON struct tags
//   - conversion function from an external type to an internal type
// ****************************************************************************

type QueueStateSnapshot struct {
	// Name of the queue.
	Queue string `json:"queue"`
	// Total number of tasks in the queue.
	Size int `json:"size"`
	// Number of tasks in each state.
	Active    int `json:"active"`
	Pending   int `json:"pending"`
	Scheduled int `json:"scheduled"`
	Retry     int `json:"retry"`
	Dead      int `json:"dead"`

	// Total number of tasks processed during the given date.
	// The number includes both succeeded and failed tasks.
	Processed int `json:"processed"`
	// Breakdown of processed tasks.
	Succeeded int `json:"succeeded"`
	Failed    int `json:"failed"`
	// Paused indicates whether the queue is paused.
	// If true, tasks in the queue will not be processed.
	Paused bool `json:"paused"`
	// Time when this snapshot was taken.
	Timestamp time.Time `json:"timestamp"`
}

func toQueueStateSnapshot(s *asynq.QueueStats) *QueueStateSnapshot {
	return &QueueStateSnapshot{
		Queue:     s.Queue,
		Size:      s.Size,
		Active:    s.Active,
		Pending:   s.Pending,
		Scheduled: s.Scheduled,
		Retry:     s.Retry,
		Dead:      s.Dead,
		Processed: s.Processed,
		Succeeded: s.Processed - s.Failed,
		Failed:    s.Failed,
		Paused:    s.Paused,
		Timestamp: s.Timestamp,
	}
}

type DailyStats struct {
	Queue     string    `json:"queue"`
	Processed int       `json:"processed"`
	Succeeded int       `json:"succeeded"`
	Failed    int       `json:"failed"`
	Date      time.Time `json:"date"`
}

func toDailyStats(s *asynq.DailyStats) *DailyStats {
	return &DailyStats{
		Queue:     s.Queue,
		Processed: s.Processed,
		Succeeded: s.Processed - s.Failed,
		Failed:    s.Failed,
		Date:      s.Date,
	}
}

type BaseTask struct {
	ID      string        `json:"id"`
	Type    string        `json:"type"`
	Payload asynq.Payload `json:"payload"`
	Queue   string        `json:"queue"`
}

type ActiveTask struct {
	*BaseTask
}

func toActiveTask(t *asynq.ActiveTask) *ActiveTask {
	base := &BaseTask{
		ID:      t.ID,
		Type:    t.Type,
		Payload: t.Payload,
		Queue:   t.Queue,
	}
	return &ActiveTask{base}
}

func toActiveTasks(in []*asynq.ActiveTask) []*ActiveTask {
	out := make([]*ActiveTask, len(in))
	for i, t := range in {
		out[i] = toActiveTask(t)
	}
	return out
}

type PendingTask struct {
	*BaseTask
}

func toPendingTask(t *asynq.PendingTask) *PendingTask {
	base := &BaseTask{
		ID:      t.ID,
		Type:    t.Type,
		Payload: t.Payload,
		Queue:   t.Queue,
	}
	return &PendingTask{base}
}

func toPendingTasks(in []*asynq.PendingTask) []*PendingTask {
	out := make([]*PendingTask, len(in))
	for i, t := range in {
		out[i] = toPendingTask(t)
	}
	return out
}

type ScheduledTask struct {
	*BaseTask
	Key           string    `json:"key"`
	NextProcessAt time.Time `json:"next_process_at"`
}

func toScheduledTask(t *asynq.ScheduledTask) *ScheduledTask {
	base := &BaseTask{
		ID:      t.ID,
		Type:    t.Type,
		Payload: t.Payload,
		Queue:   t.Queue,
	}
	return &ScheduledTask{
		BaseTask:      base,
		Key:           t.Key(),
		NextProcessAt: t.NextProcessAt,
	}
}

func toScheduledTasks(in []*asynq.ScheduledTask) []*ScheduledTask {
	out := make([]*ScheduledTask, len(in))
	for i, t := range in {
		out[i] = toScheduledTask(t)
	}
	return out
}

type RetryTask struct {
	*BaseTask
	Key           string    `json:"key"`
	NextProcessAt time.Time `json:"next_process_at"`
	MaxRetry      int       `json:"max_retry"`
	Retried       int       `json:"retried"`
	ErrorMsg      string    `json:"error_message"`
}

func toRetryTask(t *asynq.RetryTask) *RetryTask {
	base := &BaseTask{
		ID:      t.ID,
		Type:    t.Type,
		Payload: t.Payload,
		Queue:   t.Queue,
	}
	return &RetryTask{
		BaseTask:      base,
		Key:           t.Key(),
		NextProcessAt: t.NextProcessAt,
		MaxRetry:      t.MaxRetry,
		Retried:       t.Retried,
		ErrorMsg:      t.ErrorMsg,
	}
}

func toRetryTasks(in []*asynq.RetryTask) []*RetryTask {
	out := make([]*RetryTask, len(in))
	for i, t := range in {
		out[i] = toRetryTask(t)
	}
	return out
}

type DeadTask struct {
	*BaseTask
	Key          string    `json:"key"`
	MaxRetry     int       `json:"max_retry"`
	Retried      int       `json:"retried"`
	ErrorMsg     string    `json:"error_message"`
	LastFailedAt time.Time `json:"last_failed_at"`
}

func toDeadTask(t *asynq.DeadTask) *DeadTask {
	base := &BaseTask{
		ID:      t.ID,
		Type:    t.Type,
		Payload: t.Payload,
		Queue:   t.Queue,
	}
	return &DeadTask{
		BaseTask:     base,
		Key:          t.Key(),
		MaxRetry:     t.MaxRetry,
		Retried:      t.Retried,
		ErrorMsg:     t.ErrorMsg,
		LastFailedAt: t.LastFailedAt,
	}
}

func toDeadTasks(in []*asynq.DeadTask) []*DeadTask {
	out := make([]*DeadTask, len(in))
	for i, t := range in {
		out[i] = toDeadTask(t)
	}
	return out
}

type SchedulerEntry struct {
	ID            string        `json:"id"`
	Spec          string        `json:"spec"`
	TaskType      string        `json:"task_type"`
	TaskPayload   asynq.Payload `json:"task_payload"`
	Opts          []string      `json:"options"`
	NextEnqueueAt string        `json:"next_enqueue_at"`
	// This field is omitted if there were no previous enqueue events.
	PrevEnqueueAt string `json:"prev_enqueue_at,omitempty"`
}

func toSchedulerEntry(e *asynq.SchedulerEntry) *SchedulerEntry {
	opts := make([]string, 0) // create a non-nil, empty slice to avoid null in json output
	for _, o := range e.Opts {
		opts = append(opts, o.String())
	}
	prev := ""
	if !e.Prev.IsZero() {
		prev = e.Prev.Format(time.RFC3339)
	}
	return &SchedulerEntry{
		ID:            e.ID,
		Spec:          e.Spec,
		TaskType:      e.Task.Type,
		TaskPayload:   e.Task.Payload,
		Opts:          opts,
		NextEnqueueAt: e.Next.Format(time.RFC3339),
		PrevEnqueueAt: prev,
	}
}

func toSchedulerEntries(in []*asynq.SchedulerEntry) []*SchedulerEntry {
	out := make([]*SchedulerEntry, len(in))
	for i, e := range in {
		out[i] = toSchedulerEntry(e)
	}
	return out
}
