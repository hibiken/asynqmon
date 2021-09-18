package asynqmon

import (
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/hibiken/asynq"
)

// ****************************************************************************
// This file defines:
//   - internal types with JSON struct tags
//   - conversion function from an external type to an internal type
// ****************************************************************************

// PayloadStringer can be used to convert payload bytes to string to show in web ui.
type PayloadStringer interface {
	String([]byte) string
}

type PayloadStringerFunc func([]byte) string

func (f PayloadStringerFunc) String(b []byte) string {
	return f(b)
}

var defaultPayloadStringer = PayloadStringerFunc(func(payload []byte) string {
	if !isPrintable(payload) {
		return "non-printable bytes"
	}
	return string(payload)
})

// isPrintable reports whether the given data is comprised of all printable runes.
func isPrintable(data []byte) bool {
	if !utf8.Valid(data) {
		return false
	}
	isAllSpace := true
	for _, r := range string(data) {
		if !unicode.IsPrint(r) {
			return false
		}
		if !unicode.IsSpace(r) {
			isAllSpace = false
		}
	}
	return !isAllSpace
}

type transformer struct {
	ps PayloadStringer
}

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

func (t *transformer) toQueueStateSnapshot(s *asynq.QueueInfo) *QueueStateSnapshot {
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

func (t *transformer) toDailyStats(s *asynq.DailyStats) *DailyStats {
	return &DailyStats{
		Queue:     s.Queue,
		Processed: s.Processed,
		Succeeded: s.Processed - s.Failed,
		Failed:    s.Failed,
		Date:      s.Date.Format("2006-01-02"),
	}
}

func (t *transformer) toDailyStatsList(in []*asynq.DailyStats) []*DailyStats {
	out := make([]*DailyStats, len(in))
	for i, s := range in {
		out[i] = t.toDailyStats(s)
	}
	return out
}

type TaskInfo struct {
	// ID is the identifier of the task.
	ID string `json:"id"`
	// Queue is the name of the queue in which the task belongs.
	Queue string `json:"queue"`
	// Type is the type name of the task.
	Type string `json:"type"`
	// Payload is the payload data of the task.
	Payload string `json:"payload"`
	// State indicates the task state.
	State string `json:"state"`
	// MaxRetry is the maximum number of times the task can be retried.
	MaxRetry int `json:"max_retry"`
	// Retried is the number of times the task has retried so far.
	Retried int `json:"retried"`
	// LastErr is the error message from the last failure.
	LastErr string `json:"error_message"`
	// LastFailedAt is the time time of the last failure in RFC3339 format.
	// If the task has no failures, empty string.
	LastFailedAt string `json:"last_failed_at"`
	// Timeout is the number of seconds the task can be processed by Handler before being retried.
	Timeout int `json:"timeout_seconds"`
	// Deadline is the deadline for the task in RFC3339 format. If not set, empty string.
	Deadline string `json:"deadline"`
	// NextProcessAt is the time the task is scheduled to be processed in RFC3339 format.
	// If not applicable, empty string.
	NextProcessAt string `json:"next_process_at"`
}

// formatTimeInRFC3339 formats t in RFC3339 if the value is non-zero.
// If t is zero time (i.e. time.Time{}), returns empty string
func formatTimeInRFC3339(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.Format(time.RFC3339)
}

func (t *transformer) toTaskInfo(info *asynq.TaskInfo) *TaskInfo {
	return &TaskInfo{
		ID:            info.ID,
		Queue:         info.Queue,
		Type:          info.Type,
		Payload:       t.ps.String(info.Payload),
		State:         info.State.String(),
		MaxRetry:      info.MaxRetry,
		Retried:       info.Retried,
		LastErr:       info.LastErr,
		LastFailedAt:  formatTimeInRFC3339(info.LastFailedAt),
		Timeout:       int(info.Timeout.Seconds()),
		Deadline:      formatTimeInRFC3339(info.Deadline),
		NextProcessAt: formatTimeInRFC3339(info.NextProcessAt),
	}
}

type BaseTask struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	Payload   string `json:"payload"`
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

func (t *transformer) toActiveTask(ti *asynq.TaskInfo) *ActiveTask {
	base := &BaseTask{
		ID:        ti.ID,
		Type:      ti.Type,
		Payload:   t.ps.String(ti.Payload),
		Queue:     ti.Queue,
		MaxRetry:  ti.MaxRetry,
		Retried:   ti.Retried,
		LastError: ti.LastErr,
	}
	return &ActiveTask{BaseTask: base}
}

func (t *transformer) toActiveTasks(in []*asynq.TaskInfo) []*ActiveTask {
	out := make([]*ActiveTask, len(in))
	for i, ti := range in {
		out[i] = t.toActiveTask(ti)
	}
	return out
}

// TODO: Maybe we don't need state specific type, just use TaskInfo
type PendingTask struct {
	*BaseTask
}

func (t *transformer) toPendingTask(ti *asynq.TaskInfo) *PendingTask {
	base := &BaseTask{
		ID:        ti.ID,
		Type:      ti.Type,
		Payload:   t.ps.String(ti.Payload),
		Queue:     ti.Queue,
		MaxRetry:  ti.MaxRetry,
		Retried:   ti.Retried,
		LastError: ti.LastErr,
	}
	return &PendingTask{
		BaseTask: base,
	}
}

func (t *transformer) toPendingTasks(in []*asynq.TaskInfo) []*PendingTask {
	out := make([]*PendingTask, len(in))
	for i, ti := range in {
		out[i] = t.toPendingTask(ti)
	}
	return out
}

type ScheduledTask struct {
	*BaseTask
	NextProcessAt time.Time `json:"next_process_at"`
}

func (t *transformer) toScheduledTask(ti *asynq.TaskInfo) *ScheduledTask {
	base := &BaseTask{
		ID:        ti.ID,
		Type:      ti.Type,
		Payload:   t.ps.String(ti.Payload),
		Queue:     ti.Queue,
		MaxRetry:  ti.MaxRetry,
		Retried:   ti.Retried,
		LastError: ti.LastErr,
	}
	return &ScheduledTask{
		BaseTask:      base,
		NextProcessAt: ti.NextProcessAt,
	}
}

func (t *transformer) toScheduledTasks(in []*asynq.TaskInfo) []*ScheduledTask {
	out := make([]*ScheduledTask, len(in))
	for i, ti := range in {
		out[i] = t.toScheduledTask(ti)
	}
	return out
}

type RetryTask struct {
	*BaseTask
	NextProcessAt time.Time `json:"next_process_at"`
}

func (t *transformer) toRetryTask(ti *asynq.TaskInfo) *RetryTask {
	base := &BaseTask{
		ID:        ti.ID,
		Type:      ti.Type,
		Payload:   t.ps.String(ti.Payload),
		Queue:     ti.Queue,
		MaxRetry:  ti.MaxRetry,
		Retried:   ti.Retried,
		LastError: ti.LastErr,
	}
	return &RetryTask{
		BaseTask:      base,
		NextProcessAt: ti.NextProcessAt,
	}
}

func (t *transformer) toRetryTasks(in []*asynq.TaskInfo) []*RetryTask {
	out := make([]*RetryTask, len(in))
	for i, ti := range in {
		out[i] = t.toRetryTask(ti)
	}
	return out
}

type ArchivedTask struct {
	*BaseTask
	LastFailedAt time.Time `json:"last_failed_at"`
}

func (t *transformer) toArchivedTask(ti *asynq.TaskInfo) *ArchivedTask {
	base := &BaseTask{
		ID:        ti.ID,
		Type:      ti.Type,
		Payload:   t.ps.String(ti.Payload),
		Queue:     ti.Queue,
		MaxRetry:  ti.MaxRetry,
		Retried:   ti.Retried,
		LastError: ti.LastErr,
	}
	return &ArchivedTask{
		BaseTask:     base,
		LastFailedAt: ti.LastFailedAt,
	}
}

func (t *transformer) toArchivedTasks(in []*asynq.TaskInfo) []*ArchivedTask {
	out := make([]*ArchivedTask, len(in))
	for i, ti := range in {
		out[i] = t.toArchivedTask(ti)
	}
	return out
}

type SchedulerEntry struct {
	ID            string   `json:"id"`
	Spec          string   `json:"spec"`
	TaskType      string   `json:"task_type"`
	TaskPayload   string   `json:"task_payload"`
	Opts          []string `json:"options"`
	NextEnqueueAt string   `json:"next_enqueue_at"`
	// This field is omitted if there were no previous enqueue events.
	PrevEnqueueAt string `json:"prev_enqueue_at,omitempty"`
}

func (t *transformer) toSchedulerEntry(e *asynq.SchedulerEntry) *SchedulerEntry {
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
		TaskPayload:   t.ps.String(e.Task.Payload()),
		Opts:          opts,
		NextEnqueueAt: e.Next.Format(time.RFC3339),
		PrevEnqueueAt: prev,
	}
}

func (t *transformer) toSchedulerEntries(in []*asynq.SchedulerEntry) []*SchedulerEntry {
	out := make([]*SchedulerEntry, len(in))
	for i, e := range in {
		out[i] = t.toSchedulerEntry(e)
	}
	return out
}

type SchedulerEnqueueEvent struct {
	TaskID     string `json:"task_id"`
	EnqueuedAt string `json:"enqueued_at"`
}

func (t *transformer) toSchedulerEnqueueEvent(e *asynq.SchedulerEnqueueEvent) *SchedulerEnqueueEvent {
	return &SchedulerEnqueueEvent{
		TaskID:     e.TaskID,
		EnqueuedAt: e.EnqueuedAt.Format(time.RFC3339),
	}
}

func (t *transformer) toSchedulerEnqueueEvents(in []*asynq.SchedulerEnqueueEvent) []*SchedulerEnqueueEvent {
	out := make([]*SchedulerEnqueueEvent, len(in))
	for i, e := range in {
		out[i] = t.toSchedulerEnqueueEvent(e)
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

func (t *transformer) toServerInfo(info *asynq.ServerInfo) *ServerInfo {
	return &ServerInfo{
		ID:             info.ID,
		Host:           info.Host,
		PID:            info.PID,
		Concurrency:    info.Concurrency,
		Queues:         info.Queues,
		StrictPriority: info.StrictPriority,
		Started:        info.Started.Format(time.RFC3339),
		Status:         info.Status,
		ActiveWorkers:  t.toWorkerInfoList(info.ActiveWorkers),
	}
}

func (t *transformer) toServerInfoList(in []*asynq.ServerInfo) []*ServerInfo {
	out := make([]*ServerInfo, len(in))
	for i, s := range in {
		out[i] = t.toServerInfo(s)
	}
	return out
}

type WorkerInfo struct {
	TaskID     string `json:"task_id"`
	Queue      string `json:"queue"`
	TaskType   string `json:"task_type"`
	TakPayload string `json:"task_payload"`
	Started    string `json:"start_time"`
}

func (t *transformer) toWorkerInfo(info *asynq.WorkerInfo) *WorkerInfo {
	return &WorkerInfo{
		TaskID:     info.TaskID,
		Queue:      info.Queue,
		TaskType:   info.TaskType,
		TakPayload: t.ps.String(info.TaskPayload),
		Started:    info.Started.Format(time.RFC3339),
	}
}

func (t *transformer) toWorkerInfoList(in []*asynq.WorkerInfo) []*WorkerInfo {
	out := make([]*WorkerInfo, len(in))
	for i, w := range in {
		out[i] = t.toWorkerInfo(w)
	}
	return out
}
