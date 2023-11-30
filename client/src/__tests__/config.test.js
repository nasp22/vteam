const mockConfig = (config) => {
  jest.doMock(
    "../auth_config.json",
    () => ({
      domain: "test-domain.com",
      clientId: "123",
      ...config,
    }),
    { virtual: true }
  );
};

describe("The config module", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("should omit the audience if not in the config json", () => {
    mockConfig();

    const { getConfig } = require("../config");

    expect(getConfig().audience).not.toBeDefined();
  });


  it("should return the audience if specified", () => {
    mockConfig({ audience: "test-api" });

    const { getConfig } = require("../config");

    expect(getConfig().audience).toEqual("test-api");
  });
});
