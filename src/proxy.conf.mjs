export default [
  {
    context: [
      "/job",
      "/cache",
      "/options",
      "/core",
      "/fscache",
      "/debug",
      "/config",
      "/operations",
      "/backend",
      "/mount",
      "/vfs",
      "/sync",
      "/rc",
      "/pluginsctl",
    ],
    target: "http://127.0.0.1:5572",
    secure: false,
  },
];
