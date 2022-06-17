import execShellCommand from './execShellCommand';

class Summary {
  public static append(text: string): void {
    execShellCommand({
      cmd: `echo "${text}" >> $GITHUB_STEP_SUMMARY`,
    });
  }

  public static clear(): void {
    execShellCommand({
      cmd: `echo "" > $GITHUB_STEP_SUMMARY`,
    });
  }
}

export default Summary;
