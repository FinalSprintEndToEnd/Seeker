UPDATE public.user
SET username = $1,
    password = $2
WHERE email =$3;