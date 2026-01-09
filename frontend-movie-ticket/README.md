
1. sign in via clerk
2. for bakend movie data, use TMDB 
3. for TMDB images -> APiReference-> Guides-> Image-> compy till original and store in env

# Stripe
go to stripe for payment -> for payment webhook
dashboard -> webhook -> add destination -> payment intent -> payment intent succeed -> continue -> paste backend url+ /api/stripe -> create destination -> copy signin secret

#nodemailer
install nodemailer for sending mail to user

#Brevo
to get smpt details{hostname, username, password} use Brevo
in Brevo -> home -> profile -> setting -> smpt & api 
generate new smpt keys and paste in .env