@echo off
echo Redeploying your application on Render...
echo Please make sure you have the Render CLI installed and you're logged in.

echo.
echo Step 1: Committing changes...
git add .
git commit -m "Fix rate limiting issues and improve caching"

echo.
echo Step 2: Pushing changes to remote repository...
git push

echo.
echo Step 3: Your application will redeploy automatically on Render if you have auto-deploy enabled.
echo If not, please go to your Render dashboard and manually deploy the latest changes.
echo.
echo Done! Remember to monitor your application logs for any issues. 