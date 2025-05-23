export enum Role {
    ADMIN = 'admin',
    PROJECT_MANAGER = 'project_manager',
    TEAM_MEMBER = 'team_member'
  }
  
  export type UserRole = keyof typeof Role;