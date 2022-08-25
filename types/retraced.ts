export type AdminToken = {
  id: string;
  token: string;
  userId: string;
  disabled: boolean;
};

export type APIKey = {
  created: Date;
  disabled: boolean;
  environment_id: string;
  name: string;
  project_id: string;
  token: string;
};

export type Environment = {
  id: string;
  name: string;
};

export type Project = {
  created: number;
  environments: Environment[];
  id: string;
  name: string;
  tokens: APIKey[];
};

export type NewProject = {
  project: Project;
};
