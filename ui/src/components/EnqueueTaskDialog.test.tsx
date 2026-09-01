import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import EnqueueTaskDialog from "./EnqueueTaskDialog";

describe("EnqueueTaskDialog", () => {
  const defaultProps = {
    open: true,
    queue: "default",
    loading: false,
    error: null,
    onClose: jest.fn(),
    onEnqueue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the selected queue and requires a task type", () => {
    render(<EnqueueTaskDialog {...defaultProps} />);

    expect(screen.getByText("Queue: default")).toBeInTheDocument();
    expect(screen.getByLabelText("Task type")).toBeInTheDocument();
    expect(screen.getByLabelText("Payload")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enqueue" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Task type"), {
      target: { value: "  task:type  " },
    });
    expect(screen.getByRole("button", { name: "Enqueue" })).toBeEnabled();
  });

  it("passes the task type and payload to the parent", async () => {
    const onEnqueue = jest.fn(() => Promise.resolve());
    render(<EnqueueTaskDialog {...defaultProps} onEnqueue={onEnqueue} />);

    fireEvent.change(screen.getByLabelText("Task type"), {
      target: { value: "task:type" },
    });
    fireEvent.change(screen.getByLabelText("Payload"), {
      target: { value: '{"value":1}' },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enqueue" }));

    await waitFor(() => {
      expect(onEnqueue).toHaveBeenCalledWith("task:type", '{"value":1}');
    });
  });

  it("renders errors and prevents closing while loading", () => {
    const onClose = jest.fn();
    render(
      <EnqueueTaskDialog
        {...defaultProps}
        loading
        error="Unable to enqueue task"
        onClose={onClose}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to enqueue task"
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByLabelText("Enqueuing task")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("resets its fields when closed", () => {
    const { rerender } = render(<EnqueueTaskDialog {...defaultProps} />);
    fireEvent.change(screen.getByLabelText("Task type"), {
      target: { value: "task:type" },
    });
    fireEvent.change(screen.getByLabelText("Payload"), {
      target: { value: "payload" },
    });

    rerender(<EnqueueTaskDialog {...defaultProps} open={false} />);
    rerender(<EnqueueTaskDialog {...defaultProps} />);

    expect(screen.getByLabelText("Task type")).toHaveValue("");
    expect(screen.getByLabelText("Payload")).toHaveValue("");
  });
});
