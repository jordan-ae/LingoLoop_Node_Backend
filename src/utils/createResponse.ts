export const createResponse = (res: any, status: boolean, code: number, message: string, data: any = null) => {
    return res.status(code).json({
      status,
      code,
      message,
      data,
    });
  };
  