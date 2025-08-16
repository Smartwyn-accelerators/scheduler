package com.fastcode.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class SchedulerPropertiesConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(SchedulerPropertiesConfiguration.class);

    @Autowired
    private Environment env;

    private static final String FASTCODE_OFFSET_DEFAULT_ENV = "FASTCODE_OFFSET_DEFAULT";
    private static final String FASTCODE_OFFSET_DEFAULT_SYSPROP = "fastCode.offset.default";

    private static final String FASTCODE_LIMIT_DEFAULT_ENV = "FASTCODE_LIMIT_DEFAULT";
    private static final String FASTCODE_LIMIT_DEFAULT_SYSPROP = "fastCode.limit.default";

    private static final String FASTCODE_SORT_DIRECTION_DEFAULT_ENV = "FASTCODE_SORT_DIRECTION_DEFAULT";
    private static final String FASTCODE_SORT_DIRECTION_DEFAULT_SYSPROP = "fastCode.sort.direction.default";

    private static final String FASTCODE_JOBS_DEFAULT_ENV = "FASTCODE_JOBS_DEFAULT";
    private static final String FASTCODE_JOBS_DEFAULT_SYSPROP = "fastCode.jobs.default";

    /**
     * @return the default offset for fastCode
     */
    public String getFastCodeOffsetDefault() {
        return getConfigurationProperty(FASTCODE_OFFSET_DEFAULT_ENV, FASTCODE_OFFSET_DEFAULT_SYSPROP, "0");
    }

    /**
     * @return the default limit for fastCode
     */
    public String getFastCodeLimitDefault() {
        return getConfigurationProperty(FASTCODE_LIMIT_DEFAULT_ENV, FASTCODE_LIMIT_DEFAULT_SYSPROP, "10");
    }

    /**
     * @return the default sort direction for fastCode
     */
    public String getFastCodeSortDirectionDefault() {
        return getConfigurationProperty(FASTCODE_SORT_DIRECTION_DEFAULT_ENV, FASTCODE_SORT_DIRECTION_DEFAULT_SYSPROP, "ASC");
    }


    /**
     * @return the default job package for fastCode
     */
    public String getFastCodeJobsDefault() {
        return getConfigurationProperty(FASTCODE_JOBS_DEFAULT_ENV, FASTCODE_JOBS_DEFAULT_SYSPROP, "com.fastcode.scheduler.samplejobs");
    }




    /**
     * Looks for the given key in the following places (in order):
     *
     * 1) Environment variables
     * 2) System Properties
     *
     * @param envKey
     * @param sysPropKey
     * @param defaultValue
     * @return the configured property value or default value if not found
     */
    private String getConfigurationProperty(String envKey, String sysPropKey, String defaultValue) {
        String value = env.getProperty(sysPropKey);
        if (value == null || value.trim().isEmpty()) {
            value = System.getenv(envKey);
        }
        if (value == null || value.trim().isEmpty()) {
            value = defaultValue;
        }
        logger.debug("Config Property: {}/{} = {}", envKey, sysPropKey, value);
        return value;
    }
}