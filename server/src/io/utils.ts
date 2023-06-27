export const errorHandler = <T extends (...args: any[]) => any>(handler: T) => {
  const handleError = (err: Error) => {
    console.error(err);
  };

  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      const ret = handler.apply(this, args);
      if (ret && typeof ret.catch === "function") {
        // async handler
        ret.catch(handleError);
      }
      return ret;
    } catch (e) {
      // sync handler
      handleError(e);
      throw e;
    }
  };
};