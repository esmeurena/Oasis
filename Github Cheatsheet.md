# Git Cheat Sheet


## Working on code

1. Make a branch using `git checkout -b <name of branch>`
2. write your code
3. Upload it to the cloud when ready using:
  3a. `git add .`
  3b. `git commit -m "<your good commit message>"
  3c. `git push -u origin <name of branch>`

## Making a Pull Request

1. On Github, click the "pull request" button at the top. 
2. Find the branch you want to merge into another
3. Fill out the form description, title, reviewers, assignes, labels, and project
  3a. A good description should be able to state what you worked on. Example:
- [ ] Added a GET route for Spots
- [ ] Removed unnecessary imports
- [ ] Created a validation middle-ware for SPOTS request body

4. Click the green button to submit the PR

## Reviewing a Pull Request

1. Click the "pull request" button at the top of the Github page
2. Select the PR you want to review
3. Click on `files changed` tab to look at the code edited
  3a. Check mark the "viewed" tab for each thing after verifying the code will be good and you understand what it may be doing
  3b. After all files are marked "viewed", click "Add Review" button. Then you can choose to mark it as "Request Changes" or "Approve". Make sure to add a good, professional comment
  3c. Check mark off anything the submitter added in their description of the PR to make sure it aligns with what you saw in step 3b
4. Click "Merge Pull Request"
5. Determine with the submitter if you need to delete the branch or keep it open for future changes

## Bringing Code in from Github

1. Confirm if you have any changes that are currently not being tracked. Run `git status` to see this
    1a. If you do have changes, you can run `git stash` to stow them away for later, or you can push them up. See `Working on code` for more details on pushing.
    1b. If you do not have changes, skip step 1.
2. Change to the branch you want to update using `git checkout <branch>`. If you need to know which branches you can change to, run `git branch`. An * next to the branch is the one you currently are on
3. Run `git pull` to update branch
4. If you had to run `git stash` in step `1a` you can then run `git stash apply <n>` to bring back your stowed away changes.
   NOTE: The <n> is a number depending on the id of your change. run `git stash list` to see all possible stashes saved on your local machine. If you see "0" as the one you want, then the command would be `git stash apply 0`

## Updating other local branches

Say you just did `Bringing Code in from Github`. You updated a branch called `staging` and want to pull these changes in to some local branch you are working on called `anthony/example`.
1. Switch to the branch you want to update: `git checkout <branch name>`
2. Pull in the changes from the other branch `git merge <branch we want to pull from>`

Following these steps, the example would look like:

```
> git checkout anthony/example
> git merge staging
```

   
