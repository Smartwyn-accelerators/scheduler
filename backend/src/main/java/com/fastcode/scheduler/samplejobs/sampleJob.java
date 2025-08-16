package com.fastcode.scheduler.samplejobs;

import org.quartz.*;

public class sampleJob implements Job {

	@Override
	public void execute(JobExecutionContext context) {
		  JobKey key = context.getJobDetail().getKey();
	      JobDataMap dataMap = context.getJobDetail().getJobDataMap();
		  String jobValue = dataMap.getString("jobSays");

	      try {
	          Thread.sleep(20000);
			  System.out.println("executing sampleJob " + jobValue);
	      } catch (InterruptedException e) {
	          return;
	      }
		
	}

}


