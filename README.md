how to run :

setup .env file which includes supabase pooling url and jwt private key

 npm install 
 
 npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


validation is implemented wherever frontend is trying to modify records or insert one

most of the logic is ssr, except
/login , /buyers/new , /buyers/[id]/edit 
are client components wrapped inside ssr


admin credentials for demo:

username : admin 
password : qwer


skipped user history 
