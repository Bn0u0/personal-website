const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',
  timeout:30000,
  fullyParallel:true,
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  projects:[
    {name:'desktop',use:{...devices['Desktop Chrome'],reducedMotion:'reduce'}},
    {name:'mobile',use:{...devices['Pixel 7'],reducedMotion:'reduce'}}
  ]
});
