export const expectDispatch = <TFunction, TPayload>(
  mockFunction: TFunction,
  payload: TPayload
) => {
  return expect(mockFunction).toHaveBeenCalledWith(
    expect.objectContaining({
      execute: expect.any(Function),
      payload,
    })
  );
};

export const expectNoDispatch = <TFunction, TPayload>(
  mockFunction: TFunction,
  payload: TPayload
) => {
  return expect(mockFunction).not.toHaveBeenCalledWith(
    expect.objectContaining({
      execute: expect.any(Function),
      payload,
    })
  );
};
