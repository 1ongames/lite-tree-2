export default {
    public: await import('./publicConfig.json'),
    server: await import('./serverConfig.json'),
    // service: await import('./serviceConfig.json'),
    dev: await import('./devConfig.json'),
    string: await import('./stringConfig.json'),
};
