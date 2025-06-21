import morgan from 'morgan';

/**
 * Custom logger for different log levels
 */
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  info(message, data = null) {
    const logData = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...(data && { data }),
    };
    
    if (this.isDevelopment) {
      console.log('\x1b[36m%s\x1b[0m', 'INFO:', logData);
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  error(message, error = null) {
    const logData = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      ...(error && { 
        error: {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        }
      }),
    };
    
    if (this.isDevelopment) {
      console.error('\x1b[31m%s\x1b[0m', 'ERROR:', logData);
    } else {
      console.error(JSON.stringify(logData));
    }
  }

  warn(message, data = null) {
    const logData = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      ...(data && { data }),
    };
    
    if (this.isDevelopment) {
      console.warn('\x1b[33m%s\x1b[0m', 'WARN:', logData);
    } else {
      console.warn(JSON.stringify(logData));
    }
  }

  debug(message, data = null) {
    if (!this.isDevelopment) return;
    
    const logData = {
      level: 'DEBUG',
      timestamp: new Date().toISOString(),
      message,
      ...(data && { data }),
    };
    
    console.log('\x1b[35m%s\x1b[0m', 'DEBUG:', logData);
  }
}

export const logger = new Logger();

/**
 * Morgan middleware configuration for HTTP logging
 */
export const morganConfig = morgan((tokens, req, res) => {
  const logData = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: `${tokens['response-time'](req, res)} ms`,
    contentLength: tokens.res(req, res, 'content-length'),
    userAgent: tokens['user-agent'](req, res),
    timestamp: new Date().toISOString(),
  };

  const status = parseInt(tokens.status(req, res));
  
  if (status >= 400) {
    logger.error('HTTP Request Error', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
  
  return null; // Morgan will handle the output
});

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method !== 'GET' ? req.body : undefined,
  });
  next();
};

/**
 * Error logger middleware
 */
export const errorLogger = (error, req, res, next) => {
  logger.error('Unhandled Error', {
    method: req.method,
    url: req.url,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });
  next(error);
}; 