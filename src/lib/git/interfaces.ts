export interface ExecCloneProps {
  readonly repository: string;
  readonly token: string;
}

export interface ExecSwitchBranchProps {
  readonly ref: string;
}
export type CloneProps = ExecCloneProps & ExecSwitchBranchProps;
