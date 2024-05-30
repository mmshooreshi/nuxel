<template>
    <div class="p-8">
        <div class="main-input">
        <input type="text" placeholder="Enter text here" />
        </div>
        <div class="file-input">
        <input type="file" directory webkitdirectory />
        </div>
        <div class="terminals">
        <div class="terminal-frame">Terminal 1</div>
        <div class="terminal-frame">Terminal 2</div>
        <div class="terminal-frame">Terminal 3</div>
        </div>
    </div>
</template>
  
<style>
.main-input {
margin-bottom: 20px;
}
.file-input {
margin-bottom: 20px;
}
.terminals {
display: flex;
justify-content: space-between;
}
.terminal-frame {
width: 30%;
height: 300px;
background: #000;
color: #fff;
padding: 10px;
overflow: auto;
}
</style>
