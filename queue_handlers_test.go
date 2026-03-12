package asynqmon

import (
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/hibiken/asynq"
)

type fakeQueueInfoFetcher struct {
	qnames []string
	infos  map[string]*asynq.QueueInfo
	err    error

	mu            sync.Mutex
	currentCalls  int
	maxConcurrent int
	callOrder     []string
	delay         time.Duration
}

func (f *fakeQueueInfoFetcher) Queues() ([]string, error) {
	return f.qnames, nil
}

func (f *fakeQueueInfoFetcher) GetQueueInfo(qname string) (*asynq.QueueInfo, error) {
	f.mu.Lock()
	f.currentCalls++
	if f.currentCalls > f.maxConcurrent {
		f.maxConcurrent = f.currentCalls
	}
	f.callOrder = append(f.callOrder, qname)
	f.mu.Unlock()

	defer func() {
		f.mu.Lock()
		f.currentCalls--
		f.mu.Unlock()
	}()

	if f.delay > 0 {
		time.Sleep(f.delay)
	}
	if f.err != nil {
		return nil, f.err
	}
	return f.infos[qname], nil
}

func TestFetchQueueStateSnapshotsInBatchesPreservesOrder(t *testing.T) {
	fetcher := &fakeQueueInfoFetcher{
		qnames: []string{"critical", "default", "low"},
		infos: map[string]*asynq.QueueInfo{
			"critical": {Queue: "critical"},
			"default":  {Queue: "default"},
			"low":      {Queue: "low"},
		},
		delay: 10 * time.Millisecond,
	}

	got, err := fetchQueueStateSnapshotsInBatches(fetcher, fetcher.qnames, 2)
	if err != nil {
		t.Fatalf("fetchQueueStateSnapshotsInBatches returned error: %v", err)
	}

	if len(got) != len(fetcher.qnames) {
		t.Fatalf("len(got) = %d, want %d", len(got), len(fetcher.qnames))
	}
	for i, snapshot := range got {
		if snapshot.Queue != fetcher.qnames[i] {
			t.Fatalf("got queue %q at index %d, want %q", snapshot.Queue, i, fetcher.qnames[i])
		}
	}
	if fetcher.maxConcurrent > 2 {
		t.Fatalf("max concurrent calls = %d, want <= 2", fetcher.maxConcurrent)
	}
}

func TestFetchQueueStateSnapshotsInBatchesReturnsError(t *testing.T) {
	wantErr := errors.New("boom")
	fetcher := &fakeQueueInfoFetcher{
		qnames: []string{"critical", "default"},
		err:    wantErr,
	}

	_, err := fetchQueueStateSnapshotsInBatches(fetcher, fetcher.qnames, 2)
	if !errors.Is(err, wantErr) {
		t.Fatalf("error = %v, want %v", err, wantErr)
	}
}
