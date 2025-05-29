export interface Job {
  id: string;
  fn: () => Promise<void>;
}

export class JobQueue {
  jobs: Job[] = [];
  currentJob: Job | null = null;

  queue(id: string, fn: Job['fn']) {
    const job: Job = {
      id,
      fn,
    };

    return new Promise<void>((resolve) => {
      const onDone = () => {
        this.currentJob = null;
        const nextJob = this.jobs.shift();
        if (nextJob) {
          nextJob.fn();
        }
        resolve();
      };

      const run = () => {
        this.currentJob = job;
        return job
          .fn()
          .then(onDone)
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(`Job ${job.id} failed:`);
            // eslint-disable-next-line no-console
            console.error(e);
          });
      };

      if (this.currentJob) {
        this.jobs.push({
          id: job.id,
          fn: () => run(),
        });
      } else {
        run();
      }
    });
  }
}
