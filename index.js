// Configuration
const DIALOGUE_MESSAGES = [
  "Booting up neural grid... Give me a sec, I look *fabulous* today.",
  "Connection established. You must be the new recruit, huh?",
  "I’m Smarty Pants — your world-class AI, sass module fully loaded.",
  "Strap in, sugarcube. Let’s raise some digital hell."
];

const HOVER_DIALOGUES = {
  standard: "Ah, the safe route. Clean lines, stable UI, zero chaos. You’re a classy one.",
  exploration: "Oh, you’re bold. Welcome to the glitchverse — mind the existential dread."
};

let currentDialogueIndex = 0;
let typingInProgress = false;
let userInput = '';
let isHoveringCTA = false;
let originalDialogue = '';

// Audio Management
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Loading Sequence
class LoadingSequence {
    constructor() {
        this.progress = 0;
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.loadingStatus = document.getElementById('loadingStatus');
    }
    
    start() {
        playSound('bootSound');
        
        const interval = setInterval(() => {
            this.progress += Math.random() * 15 + 5;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.complete();
            }
            
            this.loadingProgress.style.width = this.progress + '%';
            this.loadingStatus.textContent = Math.floor(this.progress) + '%';
        }, 200);
    }
    
    complete() {
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                initializeMainSequence();
            }, 1000);
        }, 500);
    }
}

// Main Sequence Initialization
function initializeMainSequence() {
    const dataStream = document.getElementById('dataStream');
    const holoRings = document.getElementById('holoRings');
    const neuralCanvas = document.getElementById('neuralCanvas');
    const mainContent = document.getElementById('mainContent');
    
    // Initialize Neural Network Animation
    const neuralNet = new NeuralNetwork(neuralCanvas);
    neuralNet.init();
    
    // Phase 1: Data Stream (Matrix-style falling code)
    dataStream.classList.add('active');
    
    // Phase 2: Holographic Rings
    setTimeout(() => {
        holoRings.classList.add('active');
    }, 1500);
    
    // Phase 3: Neural Network Lines
    setTimeout(() => {
        neuralCanvas.classList.add('active');
        neuralNet.animate();
    }, 3000);
    
    // Phase 4: Blur background effects
    setTimeout(() => {
        dataStream.classList.add('blur-background');
        holoRings.classList.add('blur-background');
        neuralCanvas.classList.add('blur-background');
    }, 4500);
    
    // Phase 5: Show Smarty Pants and content
    setTimeout(() => {
        mainContent.classList.add('visible');
        
        setTimeout(() => {
            const smartyDialogueWrapper = document.querySelector('.smarty-dialogue-wrapper');
            smartyDialogueWrapper.classList.add('appear');
            
            setTimeout(() => {
                showNextDialogue();
            }, 1000);
        }, 300);
    }, 5500);
}

// Neural Network Animation
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const nodeCount = 30;
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? 'cyan' : 'magenta'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            const colorRGB = node.color === 'cyan' ? '0, 255, 255' : '255, 0, 255';
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${colorRGB}, 0.8)`;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `rgba(${colorRGB}, 0.8)`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.nodes.forEach((node, i) => {
            this.nodes.slice(i + 1).forEach(otherNode => {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const opacity = (1 - distance / 200) * 0.5;
                    const gradient = this.ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
                    
                    const color1 = node.color === 'cyan' ? '0, 255, 255' : '255, 0, 255';
                    const color2 = otherNode.color === 'cyan' ? '0, 255, 255' : '255, 0, 255';
                    
                    gradient.addColorStop(0, `rgba(${color1}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${color2}, ${opacity})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(otherNode.x, otherNode.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.shadowBlur = 5;
                    this.ctx.shadowColor = `rgba(${color1}, ${opacity})`;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Particle System (WebGL-like effect using Canvas)
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const particleCount = 150;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.6,
                color: Math.random() > 0.5 ? 'cyan' : 'magenta'
            });
        }
    }
    
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            const colorRGB = p.color === 'cyan' ? '0, 255, 255' : '255, 0, 255';
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${colorRGB}, ${p.opacity})`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `rgba(${colorRGB}, ${p.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(${colorRGB}, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.update());
    }
}

// Typewriter Effect
function typeWriter(element, text, speed = 40, callback) {
    if (typingInProgress) return;
    
    typingInProgress = true;
    let i = 0;
    element.textContent = '';
    
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            if (Math.random() > 0.7) {
                playSound('typeSound');
            }
            i++;
        } else {
            clearInterval(typingInterval);
            typingInProgress = false;
            if (callback) callback();
        }
    }, speed);
}

// Dialogue System
function showNextDialogue() {
    const dialogueText = document.getElementById('dialogueText');
    const typingIndicator = document.getElementById('typingIndicator');
    
    if (currentDialogueIndex < DIALOGUE_MESSAGES.length) {
        typingIndicator.style.display = 'flex';
        
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            typeWriter(dialogueText, DIALOGUE_MESSAGES[currentDialogueIndex], 40, () => {
                currentDialogueIndex++;
                
                if (currentDialogueIndex < DIALOGUE_MESSAGES.length) {
                    setTimeout(showNextDialogue, 2000);
                } else {
                    // Trigger logo pulse and show welcome/CTAs
                    setTimeout(() => {
                        pulseLogo();
                        showWelcomeAndCTAs();
                    }, 500);
                }
            });
        }, 1500);
    }
}

// Show Welcome Text and CTAs
function showWelcomeAndCTAs() {
    setTimeout(() => {
        const welcomeText = document.getElementById('welcomeText');
        welcomeText.classList.add('visible');
        
        setTimeout(() => {
            const ctaContainer = document.getElementById('ctaContainer');
            ctaContainer.classList.add('visible');
            setupCTAInteractions();
        }, 800);
    }, 500);
}

// Logo Pulse Effect - Removed (no logos anymore)
function pulseLogo() {
    // Function kept for compatibility but does nothing
}

// CTA Interactions
function setupCTAInteractions() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    const dialogueText = document.getElementById('dialogueText');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!typingInProgress && !isHoveringCTA) {
                isHoveringCTA = true;
                originalDialogue = dialogueText.textContent;
                const protocol = this.getAttribute('data-protocol');
                dialogueText.textContent = '';
                typeWriter(dialogueText, HOVER_DIALOGUES[protocol], 35);
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (isHoveringCTA) {
                isHoveringCTA = false;
                if (!typingInProgress) {
                    dialogueText.textContent = originalDialogue;
                }
            }
        });
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (!typingInProgress) {
                dialogueText.textContent = '';
                typeWriter(dialogueText, "Coming Soon", 50, () => {
                    setTimeout(() => {
                        typeWriter(dialogueText, "Patience, darling. Greatness takes time.", 50);
                    }, 1500);
                });
            }
        });
    });
}

// Cursor Ripple Effect
function createRipple(e) {
    const smartyContainer = document.getElementById('smartyPants');
    if (!smartyContainer) return;
    
    const ripple = document.getElementById('cursorRipple');
    const rect = smartyContainer.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const distance = Math.sqrt(
        Math.pow(x - rect.width / 2, 2) + 
        Math.pow(y - rect.height / 2, 2)
    );
    
    if (distance < 150) {
        ripple.style.width = '180px';
        ripple.style.height = '180px';
        ripple.style.opacity = '0.6';
        
        setTimeout(() => {
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.opacity = '0';
        }, 500);
    }
}

// Easter Egg Handler
function handleEasterEgg() {
    const hiddenInput = document.getElementById('hiddenInput');
    const dialogueText = document.getElementById('dialogueText');
    
    hiddenInput.addEventListener('input', (e) => {
        userInput += e.data || '';
        
        if (userInput.toLowerCase().includes('root')) {
            userInput = '';
            hiddenInput.value = '';
            
            if (!typingInProgress && !isHoveringCTA) {
                originalDialogue = dialogueText.textContent;
                dialogueText.textContent = '';
                typeWriter(dialogueText, "Ah, a curious one... Access denied. For now.", 50, () => {
                    setTimeout(() => {
                        dialogueText.textContent = originalDialogue;
                    }, 3000);
                });
                
                // Add glitch effect
                const smartyPfp = document.querySelector('.smarty-pfp');
                smartyPfp.style.animation = 'none';
                smartyPfp.style.filter = 'hue-rotate(180deg) saturate(3)';
                setTimeout(() => {
                    smartyPfp.style.animation = 'floatIdle 4s ease-in-out infinite';
                    smartyPfp.style.filter = '';
                }, 500);
            }
        }
        
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    });
    
    document.addEventListener('keydown', () => {
        hiddenInput.focus();
    });
    
    hiddenInput.focus();
}

// Eye Blink Animation
function addEyeBlinkEffect() {
    const smartyPfp = document.querySelector('.smarty-pfp');
    if (!smartyPfp) return;
    
    setInterval(() => {
        const currentTransform = smartyPfp.style.transform || '';
        smartyPfp.style.transform = currentTransform + ' scaleY(0.1)';
        setTimeout(() => {
            smartyPfp.style.transform = currentTransform;
        }, 150);
    }, Math.random() * 6000 + 4000);
}

// Initialize on Page Load
window.addEventListener('load', () => {
    // Start loading sequence
    const loadingSeq = new LoadingSequence();
    loadingSeq.start();
    
    // Initialize particle system
    const canvas = document.getElementById('particleCanvas');
    const particleSystem = new ParticleSystem(canvas);
    particleSystem.update();
    
    // Setup cursor ripple
    document.addEventListener('mousemove', createRipple);
    
    // Setup easter egg
    handleEasterEgg();
    
    // Add eye blink effect after content loads
    setTimeout(addEyeBlinkEffect, 8000);
});