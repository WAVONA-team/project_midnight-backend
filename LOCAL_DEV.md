1. Go to the [supabase.com](https://supabase.com/)
2. Register, and remember all passwords that
![image](https://github.com/WAVONA-team/project_midnight-backend/assets/79021164/a60ffa8b-e7f6-40e6-bd58-eff96da57047)
3. Create a new project and **REMEMBER THE DATABASE PASSWORD**
![image](https://github.com/WAVONA-team/project_midnight-backend/assets/79021164/99472fdd-8d5b-430d-9834-77cfe0a47338)
![image](https://github.com/WAVONA-team/project_midnight-backend/assets/79021164/5957b0c0-68cf-4c3f-a3c8-3650b07c1c58)
4. Wait untill the project will be created
5. Go to `project settings` => `database` 
![image](https://github.com/WAVONA-team/project_midnight-backend/assets/79021164/07edc101-b6d2-46fa-9842-010190dc3250)
6. Copy this url, replace the password with your `db password` and insert it to backend `.env`. Example:
```
postgres://postgres.aivdiklgkfkbfebciyww:MYPASSWORD1234@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```
![image](https://github.com/WAVONA-team/project_midnight-backend/assets/79021164/1049f29f-a24d-4c2f-9872-aa34b73e532c)
![image](https://github.com/WAVONA-team/project_midnight-backend/assets/79021164/5b174fd5-48bb-4e1a-b2c1-b6a2369d36e4)
7. Run
```
npm run db:update
```

Now you can start develop your features locally. Good luck!
