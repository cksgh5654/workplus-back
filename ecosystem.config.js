module.exports = {
  apps: [
    {
      name: "workplus-back",
      script: "index.js",
      env_file: "/home/ubuntu/workplus-back/.env", // 절대 경로
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
