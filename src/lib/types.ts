export type Filter = "all" | "todo" | "done";

export type Task = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type AddParams = {
  todo: string;
  completed: boolean;
  userId: number;
};
