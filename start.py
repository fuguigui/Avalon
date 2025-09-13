# deploy_nextjs_firebase.py
import shutil
import os
import subprocess

# Build Next.js
subprocess.run(["npm", "run", "build"], check=True)

# Copy .next to functions/next
if os.path.exists("functions/next"):
    shutil.rmtree("functions/next")
shutil.copytree(".next", "functions/next")

# Copy package.json and node_modules
shutil.copy("package.json", "functions/package.json")
if os.path.exists("functions/node_modules"):
    shutil.rmtree("functions/node_modules")
shutil.copytree("node_modules", "functions/node_modules")

