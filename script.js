document.addEventListener('DOMContentLoaded', () => {
    const optionInput = document.getElementById('optionInput');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const optionsList = document.getElementById('optionsList');
    const decideBtn = document.getElementById('decideBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const resultDisplay = document.getElementById('resultDisplay');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const messageBoxCloseBtn = document.getElementById('messageBoxCloseBtn');

    let options = [];

    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = {
        x: undefined,
        y: undefined
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas(); 
    window.addEventListener('resize', resizeCanvas); 

   
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
      
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
    });

   
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1; 6
            this.speedX = Math.random() * 3 - 1.5; 
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 360}, 100%, 70%)`; 
            this.opacity = 1;
            this.life = 100;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.05; 
            if (this.opacity > 0) this.opacity -= 0.01; 
            this.life--;
        }

        draw() {
            ctx.fillStyle = `hsla(${this.color.match(/\d+/)[0]}, 100%, 70%, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

   
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            
            if (particles[i].size <= 0.2 || particles[i].life <= 0) {
                particles.splice(i, 1);
                i--; 
            }
        }
        requestAnimationFrame(animateParticles);
    }

    animateParticles(); 


    function showMessageBox(message) {
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
    }

    function hideMessageBox() {
        messageBox.classList.add('hidden');
    }

    messageBoxCloseBtn.addEventListener('click', hideMessageBox);

    function renderOptions() {
        optionsList.innerHTML = '';
        if (options.length === 0) {
            optionsList.innerHTML = '<li class="text-gray-500 text-center py-4">No options added yet.</li>';
            decideBtn.disabled = true; 
            clearAllBtn.disabled = true; 
            resultDisplay.textContent = 'Your decision will appear here!';
            resultDisplay.style.animation = 'none'; 
        } else {
            options.forEach((option, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('fade-in'); 
                listItem.innerHTML = `
                    <span>${option}</span>
                    <button class="remove-btn" data-index="${index}">&times;</button>
                `;
                optionsList.appendChild(listItem);
            });
            decideBtn.disabled = false;
            clearAllBtn.disabled = false;
        }
    }

   
    function addOption() {
        const optionText = optionInput.value.trim();
        if (optionText) {
            options.push(optionText);
            optionInput.value = ''; 
            renderOptions();
        } else {
            showMessageBox('Please enter an option before adding.');
        }
    }

    
    addOptionBtn.addEventListener('click', addOption);

    optionInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addOption();
        }
    });

    optionsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const indexToRemove = parseInt(event.target.dataset.index);
            const listItem = event.target.closest('li');

            listItem.classList.add('fade-out');

            listItem.addEventListener('transitionend', () => {
                options.splice(indexToRemove, 1); 
                renderOptions();
            }, { once: true }); 
        }
    });

    function makeDecision() {
        if (options.length === 0) {
            showMessageBox('Please add some options first!');
            return;
        }

        resultDisplay.style.animation = 'none';
        void resultDisplay.offsetWidth;

        const randomIndex = Math.floor(Math.random() * options.length);
        const decision = options[randomIndex];
        resultDisplay.textContent = decision;
        resultDisplay.style.animation = 'zoomInOut 1s infinite alternate';
    }

    decideBtn.addEventListener('click', makeDecision);

    function clearAllOptions() {
        if (options.length === 0) {
            showMessageBox('There are no options to clear!');
            return;
        }
        options = [];
        renderOptions();
        showMessageBox('All options have been cleared!');
    }

   
    clearAllBtn.addEventListener('click', clearAllOptions);

   
    renderOptions();
});
