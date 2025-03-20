module.exports = {
  apps: [
    {
      name: "workplus-back",
      script: "index.js",
      env_file: ".env",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
