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
