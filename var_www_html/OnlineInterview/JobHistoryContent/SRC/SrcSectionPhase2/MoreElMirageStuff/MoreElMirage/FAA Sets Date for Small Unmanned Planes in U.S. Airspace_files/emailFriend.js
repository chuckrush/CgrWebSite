function emailFriend()
{
mail_str = "mailto:?subject=NDIA:  " + document.title;
mail_str += "&body=I thought you might be interested in this page that I found at NDIA:  " + document.title;
mail_str += ".  You can view it by clicking on the following link:  " + location.href; 
location.href = mail_str;
}