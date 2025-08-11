process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    browsers: ["Chrome"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-gpu",
          "--window-size=1280,800",
          "--no-sandbox",
          "--remote-debugging-port=9222",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      },
    },
    client: {
      clearContext: false,
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "coverage"),
      subdir: ".",
      reporters: [
        { type: "html", subdir: "report-html" },
        { type: "lcov", subdir: "report-lcov" },
        { type: "text-summary" },
      ],
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    autoWatch: true,
    singleRun: false,
    colors: true,
    concurrency: Infinity,
    restartOnFileChange: true,
    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 60000,
  });
};