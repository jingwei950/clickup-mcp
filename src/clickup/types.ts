export interface CreateFolderFromTemplateOptions {
  name: string;
  return_immediately?: boolean;
  content?: string;
  time_estimate?: boolean;
  automation?: boolean;
  include_views?: boolean;
  old_due_date?: boolean;
  old_start_date?: boolean;
  old_followers?: boolean;
  comment_attachments?: boolean;
  recur_settings?: boolean;
  old_tags?: boolean;
  old_statuses?: boolean;
  subtasks?: boolean;
  custom_type?: boolean;
  old_assignees?: boolean;
  attachments?: boolean;
  comment?: boolean;
  old_status?: boolean;
  external_dependencies?: boolean;
  internal_dependencies?: boolean;
  priority?: boolean;
  custom_fields?: boolean;
  old_checklists?: boolean;
  relationships?: boolean;
  old_subtask_assignees?: boolean;
  start_date?: string; // Should be ISO date string
  due_date?: string; // Should be ISO date string
  remap_start_date?: boolean;
  skip_weekends?: boolean;
  archived?: number | null; // 1 or 2 or null
}

export interface CreateTaskData {
  name: string;
  description?: string;
  assignees?: string[];
  tags?: string[];
  priority?: number;
  dueDate?: string; // Use the name from client.ts createTask params
  // Optional: Add status, parent, links_to, etc. if needed
}

export interface Task {
  id: string;
  name: string;
  // Add other fields returned by the ClickUp API like status, description, assignees, etc.
  [key: string]: any; // Allow for flexibility
}

export interface UpdateTaskData {
  taskId: string;
  custom_item_id?: number | null;
  name?: string;
  description?: string; // Note: Use " " to clear description
  markdown_content?: string; // Overrides description if provided
  status?: string;
  priority?: number; // Integer expected by ClickUp API
  due_date?: number; // Timestamp
  due_date_time?: boolean;
  parent?: string; // Task ID
  time_estimate?: number; // Integer
  start_date?: number; // Timestamp
  start_date_time?: boolean;
  points?: number;
  assignees?: { add?: number[]; rem?: number[] };
  group_assignees?: { add?: number[]; rem?: number[] };
  watchers?: { add?: number[]; rem?: number[] };
  archived?: boolean;
}

export interface UpdateTaskQueryParams {
  custom_task_ids?: boolean;
  team_id?: number;
}
