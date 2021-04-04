package main

import (
	"time"

	"github.com/hibiken/asynq/inspeq"
)

// ****************************************************************************
// This file defines:
//   - internal types with JSON struct tags
//   - conversion function from an external type to an internal type
// ****************************************************************************

type QueueStateSnapshot struct {
	// Name of the queue.
	Queue string `json:"queue"`
	// Total number of bytes the queue and its tasks require to be stored in redis.
	MemoryUsage int64 `json:"memory_usage_bytes"`
	// Total number of tasks in the queue.
	Size int `json:"size"`
	// Number of tasks in each state.
	Active    int `json:"active"`
	Pending   int `json:"pending"`
	Scheduled int `json:"scheduled"`
	Retry     int `json:"retry"`
	Archived  int `json:"archived"`

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

func toQueueStateSnapshot(s *inspeq.QueueStats) *QueueStateSnapshot {
	return &QueueStateSnapshot{
		Queue:       s.Queue,
		MemoryUsage: s.MemoryUsage,
		Size:        s.Size,
		Active:      s.Active,
		Pending:     s.Pending,
		Scheduled:   s.Scheduled,
		Retry:       s.Retry,
		Archived:    s.Archived,
		Processed:   s.Processed,
		Succeeded:   s.Processed - s.Failed,
		Failed:      s.Failed,
		Paused:      s.Paused,
		Timestamp:   s.Timestamp,
	}
}

type DailyStats struct {
	Queue     string `json:"queue"`
	Processed int    `json:"processed"`
	Succeeded int    `json:"succeeded"`
	Failed    int    `json:"failed"`
	Date      string `json:"date"`
}

func toDailyStats(s *inspeq.DailyStats) *DailyStats {
	return &DailyStats{
		Queue:     s.Queue,
		Processed: s.Processed,
		Succeeded: s.Processed - s.Failed,
		Failed:    s.Failed,
		Date:      s.Date.Format("2006-01-02"),
	}
}

func toDailyStatsList(in []*inspeq.DailyStats) []*DailyStats {
	out := make([]*DailyStats, len(in))
	for i, s := range in {
		out[i] = toDailyStats(s)
	}
	return out
}

type BaseTask struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	Payload   []byte `json:"payload"`
	Queue     string `json:"queue"`
	MaxRetry  int    `json:"max_retry"`
	Retried   int    `json:"retried"`
	LastError string `json:"error_message"`
}

type ActiveTask struct {
	*BaseTask

	// Started time indicates when a worker started working on ths task.
	//
	// Value is either time formatted in RFC3339 format, or "-" which indicates
	// a worker started working on the task only a few moments ago, and started time
	// data is not available.
	Started string `json:"start_time"`

	// Deadline indicates the time by which the worker needs to finish its task.
	//
	// Value is either time formatted in RFC3339 format, or "-" which indicates that
	// the data is not available yet.
	Deadline string `json:"deadline"`
}

func toActiveTask(t *inspeq.ActiveTask) *ActiveTask {
	base := &BaseTask{
		ID:        t.ID,
		Type:      t.Type(),
		Payload:   t.Payload(),
		Queue:     t.Queue,
		MaxRetry:  t.MaxRetry,
		Retried:   t.Retried,
		LastError: t.LastError,
	}
	return &ActiveTask{BaseTask: base}
}

func toActiveTasks(in []*inspeq.ActiveTask) []*ActiveTask {
	out := make([]*ActiveTask, len(in))
	for i, t := range in {
		out[i] = toActiveTask(t)
	}
	return out
}

type PendingTask struct {
	*BaseTask
	Key string `json:"key"`
}

func toPendingTask(t *inspeq.PendingTask) *PendingTask {
	base := &BaseTask{
		ID:        t.ID,
		Type:      t.Type(),
		Payload:   t.Payload(),
		Queue:     t.Queue,
		MaxRetry:  t.MaxRetry,
		Retried:   t.Retried,
		LastError: t.LastError,
	}
	return &PendingTask{
		BaseTask: base,
		Key:      t.Key(),
	}
}

func toPendingTasks(in []*inspeq.PendingTask) []*PendingTask {
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

func toScheduledTask(t *inspeq.ScheduledTask) *ScheduledTask {
	base := &BaseTask{
		ID:        t.ID,
		Type:      t.Type(),
		Payload:   t.Payload(),
		Queue:     t.Queue,
		MaxRetry:  t.MaxRetry,
		Retried:   t.Retried,
		LastError: t.LastError,
	}
	return &ScheduledTask{
		BaseTask:      base,
		Key:           t.Key(),
		NextProcessAt: t.NextProcessAt,
	}
}

func toScheduledTasks(in []*inspeq.ScheduledTask) []*ScheduledTask {
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
}

func toRetryTask(t *inspeq.RetryTask) *RetryTask {
	base := &BaseTask{
		ID:        t.ID,
		Type:      t.Type(),
		Payload:   t.Payload(),
		Queue:     t.Queue,
		MaxRetry:  t.MaxRetry,
		Retried:   t.Retried,
		LastError: t.LastError,
	}
	return &RetryTask{
		BaseTask:      base,
		Key:           t.Key(),
		NextProcessAt: t.NextProcessAt,
	}
}

func toRetryTasks(in []*inspeq.RetryTask) []*RetryTask {
	out := make([]*RetryTask, len(in))
	for i, t := range in {
		out[i] = toRetryTask(t)
	}
	return out
}

type ArchivedTask struct {
	*BaseTask
	Key          string    `json:"key"`
	LastFailedAt time.Time `json:"last_failed_at"`
}

func toArchivedTask(t *inspeq.ArchivedTask) *ArchivedTask {
	base := &BaseTask{
		ID:        t.ID,
		Type:      t.Type(),
		Payload:   t.Payload(),
		Queue:     t.Queue,
		MaxRetry:  t.MaxRetry,
		Retried:   t.Retried,
		LastError: t.LastError,
	}
	return &ArchivedTask{
		BaseTask:     base,
		Key:          t.Key(),
		LastFailedAt: t.LastFailedAt,
	}
}

func toArchivedTasks(in []*inspeq.ArchivedTask) []*ArchivedTask {
	out := make([]*ArchivedTask, len(in))
	for i, t := range in {
		out[i] = toArchivedTask(t)
	}
	return out
}

type SchedulerEntry struct {
	ID            string   `json:"id"`
	Spec          string   `json:"spec"`
	TaskType      string   `json:"task_type"`
	TaskPayload   []byte   `json:"task_payload"`
	Opts          []string `json:"options"`
	NextEnqueueAt string   `json:"next_enqueue_at"`
	// This field is omitted if there were no previous enqueue events.
	PrevEnqueueAt string `json:"prev_enqueue_at,omitempty"`
}

func toSchedulerEntry(e *inspeq.SchedulerEntry) *SchedulerEntry {
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
		TaskType:      e.Task.Type(),
		TaskPayload:   e.Task.Payload(),
		Opts:          opts,
		NextEnqueueAt: e.Next.Format(time.RFC3339),
		PrevEnqueueAt: prev,
	}
}

func toSchedulerEntries(in []*inspeq.SchedulerEntry) []*SchedulerEntry {
	out := make([]*SchedulerEntry, len(in))
	for i, e := range in {
		out[i] = toSchedulerEntry(e)
	}
	return out
}

type SchedulerEnqueueEvent struct {
	TaskID     string `json:"task_id"`
	EnqueuedAt string `json:"enqueued_at"`
}

func toSchedulerEnqueueEvent(e *inspeq.SchedulerEnqueueEvent) *SchedulerEnqueueEvent {
	return &SchedulerEnqueueEvent{
		TaskID:     e.TaskID,
		EnqueuedAt: e.EnqueuedAt.Format(time.RFC3339),
	}
}

func toSchedulerEnqueueEvents(in []*inspeq.SchedulerEnqueueEvent) []*SchedulerEnqueueEvent {
	out := make([]*SchedulerEnqueueEvent, len(in))
	for i, e := range in {
		out[i] = toSchedulerEnqueueEvent(e)
	}
	return out
}

type ServerInfo struct {
	ID             string         `json:"id"`
	Host           string         `json:"host"`
	PID            int            `json:"pid"`
	Concurrency    int            `json:"concurrency"`
	Queues         map[string]int `json:"queue_priorities"`
	StrictPriority bool           `json:"strict_priority_enabled"`
	Started        string         `json:"start_time"`
	Status         string         `json:"status"`
	ActiveWorkers  []*WorkerInfo  `json:"active_workers"`
}

func toServerInfo(info *inspeq.ServerInfo) *ServerInfo {
	return &ServerInfo{
		ID:             info.ID,
		Host:           info.Host,
		PID:            info.PID,
		Concurrency:    info.Concurrency,
		Queues:         info.Queues,
		StrictPriority: info.StrictPriority,
		Started:        info.Started.Format(time.RFC3339),
		Status:         info.Status,
		ActiveWorkers:  toWorkerInfoList(info.ActiveWorkers),
	}
}

func toServerInfoList(in []*inspeq.ServerInfo) []*ServerInfo {
	out := make([]*ServerInfo, len(in))
	for i, s := range in {
		out[i] = toServerInfo(s)
	}
	return out
}

type WorkerInfo struct {
	Task    *ActiveTask `json:"task"`
	Started string      `json:"start_time"`
}

func toWorkerInfo(info *inspeq.WorkerInfo) *WorkerInfo {
	return &WorkerInfo{
		Task:    toActiveTask(info.Task),
		Started: info.Started.Format(time.RFC3339),
	}
}

func toWorkerInfoList(in []*inspeq.WorkerInfo) []*WorkerInfo {
	out := make([]*WorkerInfo, len(in))
	for i, w := range in {
		out[i] = toWorkerInfo(w)
	}
	return out
}
