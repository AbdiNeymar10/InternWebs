// notification.service.ts
type NotificationType =
  | "new_leave_submission"
  | "new_request"
  | "status_update"
  | "pending_count_alert";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  requestId?: number;
  read: boolean;
  timestamp: Date;
}

let globalNotifications: Notification[] = [];

export function getNotifications(type?: "dept" | "hr"): Notification[] {
  if (!type) return [...globalNotifications];
  return globalNotifications.filter(
    (n) =>
      (type === "dept" &&
        (n.type === "new_request" || n.type === "status_update")) ||
      (type === "hr" &&
        (n.type === "new_leave_submission" || n.type === "status_update"))
  );
}

export function addNotification(
  notification: Omit<Notification, "id" | "read" | "timestamp">
): void {
  const exists = globalNotifications.some(
    (n) =>
      n.requestId === notification.requestId && n.type === notification.type
  );

  if (!exists) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      timestamp: new Date(),
    };
    globalNotifications = [
      newNotification,
      ...globalNotifications.slice(0, 49),
    ]; // Keep last 50
  }
}

export function markNotificationsAsRead(type?: "dept" | "hr"): void {
  globalNotifications = globalNotifications.map((n) => {
    if (
      !type ||
      (type === "dept" &&
        (n.type === "new_request" || n.type === "status_update")) ||
      (type === "hr" &&
        (n.type === "new_leave_submission" || n.type === "status_update"))
    ) {
      return { ...n, read: true };
    }
    return n;
  });
}

export function clearNotification(
  requestId: number,
  type: NotificationType
): void {
  globalNotifications = globalNotifications.filter(
    (n) => !(n.requestId === requestId && n.type === type)
  );
}
