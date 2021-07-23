How to install the developer edition of Explain

As Explain is completely open-source it only uses external open-source software-packages to run.

Install VS Code     : https://code.visualstudio.com/download <br>
Install Git	        : https://git-scm.com/downloads <br>
Install NodeJs		  : https://nodejs.org/en/download/ <br>
Sign up for GitHub	: https://github.com <br>

Go to the command prompt (Windows) or Terminal (Linux/OSX).<br><br>
Register your git username and email to Git with commands: <br>
      <i>git config --global user.name “your username”</i> <br>
      <i>git config –global user.email “your email”</i> <br>
<br>
Install the Yarn package manager with command: <i>npm install -g yarn</i> <br>
<br>
Install the Quasar framework with command: <i>npm install -g @quasar/cli</i><br>
<br>
Go to the command prompt (Windows) or Terminal(Linux/OSX) if not already open.<br>
Make a directory where you want to put the explain application.<br>
  <i>mkdir projects</i><br>
  Change directory to the newly created folder with command.<br>
   <i>cd projects</i><br>
  Clone the GitHub Explain project with command<br>
    <i>git clone https://github.com/Dobutamine/explain.git</i><br>
  Navigate into the explain directory with command<br>
    <i>cd explain</i><br>
  Update the dependencies with command<br>
    <i>yarn</i><br>
<br>
WINDOWS USERS ONLY!<br>
To allow the scripts to run, open the Powershell with administrator rights.<br>
You can find Powershell in your start menu. Right click Powershell en select Run as administrator. <br>
In the Powershell window type:<br>
  <i>Set-ExecutionPolicy unrestricted</i><br>

<br>
FIRST TIME RUN<br>
Open VS Code from the desktop or Start menu.<br>
- Goto File -> Open<br>
- Navigate to the explain directory and select Open.<br>
-	If asked by VS Code in right lower corner -> Install recommended extensions -> yes!<br>
- First click on the the master branch in the lower left corner of VS Code.<br>
- Create a new branch for yourself to work in (top middle in VS Code). You can choose any name.<br>
<br>
RUNNING EXPLAIN<br>
-	In VS Code with the Explain project loaded (see step above)
Go to Terminal in the menu bar and choose New Terminal<br>
In the terminal window below enter the command<br>
<i>quasar dev</i><br>
Go to any browser (prefereably Chrome) and type in the addressbar<br>
<i>localhost:8080</i>


Have fun!
