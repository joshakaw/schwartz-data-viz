select user.hearAboutUsDropdown  as 'category' , count(*) as 'signups' from `user`
group by user.hearAboutUsDropdown 
order by count(*) desc