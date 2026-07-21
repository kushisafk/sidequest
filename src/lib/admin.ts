const ADMIN_HANDLES = ["kushisafk"]

export function isAdminHandle(githubHandle: string): boolean {
  return ADMIN_HANDLES.includes(githubHandle.toLowerCase())
}
