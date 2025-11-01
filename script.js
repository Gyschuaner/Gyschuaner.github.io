// 修仙境界系统配置
const REALMS = [
  "练气期",
  "筑基期",
  "金丹期",
  "元婴期",
  "化神期",
  "炼虚期",
  "合体期",
  "大乘期",
  "渡劫期",
  "真仙期",
  "金仙期",
  "太乙金仙",
  "大罗金仙",
  "准圣",
  "圣人"
];

// 状态数据
const state = {
    // 修仙境界：realmIndex(大境界索引), stageIndex(小境界索引), levelIndex(等级索引)
    cultivation: {
        realmIndex: 0,
        stageIndex: 0,
        levelIndex: 0
    },
    currentExp: 0,
    totalExp: 0,
    totalLevel: 1,
    tasks: [],
    events: [],
    // 技能系统
    skillPoints: 0,
    skills: {
        // 经验直觉技能
        experienceIntuition: {
            level: 0,
            unlocked: false
        },
        // 经验增幅技能
        experienceBoost: {
            level: 0,
            unlocked: false
        },
        // 任务专精技能
        taskSpecialization: {
            level: 0,
            unlocked: false
        }
    }
};

// 编辑任务时临时存储的任务ID
let editingTaskId = null;
let editingTaskDifficulty = 'normal';

// DOM 元素
const elements = {
    // 境界信息
    currentRealm: document.getElementById('current-realm'),
    totalExp: document.getElementById('total-exp'),
    totalLevel: document.getElementById('total-level'),
    nextLevelText: document.getElementById('next-level-text'),
    expProgress: document.getElementById('exp-progress'),
    expText: document.getElementById('exp-text'),
    expPercentage: document.getElementById('exp-percentage'),
    
    // 标签页
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // 任务系统
    taskInput: document.getElementById('task-input'),
    taskExpInput: document.getElementById('task-exp-input'),
    // 任务系统中的难度按钮组
    difficultyButtons: document.querySelectorAll('.difficulty-btn'),
    taskTypeRadios: document.querySelectorAll('input[name="task-type"]'),
    normalTaskSection: document.getElementById('normal-task-section'),
    timerTaskSection: document.getElementById('timer-task-section'),
    taskDurationInput: document.getElementById('task-duration-input'),
    taskExpPerMinuteInput: document.getElementById('task-exp-per-minute-input'),
    addTaskBtn: document.getElementById('add-task'),
    taskList: document.getElementById('task-list'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // 大事件系统
    eventTitleInput: document.getElementById('event-title-input'),
    eventContentInput: document.getElementById('event-content-input'),
    addEventBtn: document.getElementById('add-event'),
    eventList: document.getElementById('event-list'),
    
    // 模态框
    levelUpModal: document.getElementById('level-up-modal'),
    levelUpMessage: document.getElementById('level-up-message'),
    levelUpClose: document.getElementById('level-up-close'),
    editModal: document.getElementById('edit-modal'),
    editTaskInput: document.getElementById('edit-task-input'),
    editExpInput: document.getElementById('edit-exp-input'),
    saveEditBtn: document.getElementById('save-edit'),
    cancelEditBtn: document.getElementById('cancel-edit')
};

// 计算下一级所需经验值
function calculateExpToNextLevel(realmIndex, stageIndex, levelIndex) {
    // 基础经验值
    const baseExp = 25;
    // 大境界系数：每个大境界经验需求增加2倍
    const realmMultiplier = Math.pow(2, realmIndex);
    // 层系数：每层比上层升级所需经验多3%（指数级增长）
    const stageMultiplier = Math.pow(1.03, stageIndex);
    // 等级系数：同层内每级经验值保持不变，设为1
    const levelMultiplier = 1;
    
    return Math.floor(baseExp * realmMultiplier * stageMultiplier * levelMultiplier);
}

// 获取当前境界文本
function getCurrentRealmText() {
    // 计算阶数（0:下阶, 1:中阶, 2:上阶）
    const stageRank = Math.floor(state.cultivation.stageIndex / 10);
    const rankText = ['下', '中', '上'][stageRank];
    // 计算层数（每阶10层）
    const layerIndex = state.cultivation.stageIndex % 10;
    return `${REALMS[state.cultivation.realmIndex]}${rankText}阶第${layerIndex + 1}层第${state.cultivation.levelIndex + 1}级`;
}

// 计算总等级
function getTotalLevel() {
    // 总等级 = 大境界*300 + 阶数*100 + 层数*10 + 当前等级
    // 每个大境界3阶，每阶10层，每层10级
    const totalLevel = state.cultivation.realmIndex * 300 + 
                       state.cultivation.stageIndex * 10 + 
                       state.cultivation.levelIndex + 1;
    // 更新状态中的总等级
    state.totalLevel = totalLevel;
    return totalLevel;
}

// 获取下一级境界文本
function getNextRealmText() {
    let nextRealmIndex = state.cultivation.realmIndex;
    let nextStageIndex = state.cultivation.stageIndex;
    let nextLevelIndex = state.cultivation.levelIndex + 1;
    
    // 处理升级逻辑
    if (nextLevelIndex >= 10) { // 10级升一层
        nextLevelIndex = 0;
        nextStageIndex += 1;
        
        if (nextStageIndex >= 30) { // 30层（3阶，每阶10层）升一个大境界
            nextStageIndex = 0;
            nextRealmIndex += 1;
            
            if (nextRealmIndex >= REALMS.length) {
                return "已经达到最高境界！";
            }
        }
    }
    
    // 计算阶数和层数
    const stageRank = Math.floor(nextStageIndex / 10);
    const rankText = ['下', '中', '上'][stageRank];
    const layerIndex = nextStageIndex % 10;
    return `${REALMS[nextRealmIndex]}${rankText}阶第${layerIndex + 1}层第${nextLevelIndex + 1}级`;
}

// 更新境界UI
function updateCultivationUI() {
    elements.currentRealm.textContent = getCurrentRealmText();
    elements.totalExp.textContent = state.totalExp.toFixed(2);
    
    // 更新总等级
    if (elements.totalLevel) {
        elements.totalLevel.textContent = getTotalLevel();
    }
    
    const expToNextLevel = calculateExpToNextLevel(
        state.cultivation.realmIndex,
        state.cultivation.stageIndex,
        state.cultivation.levelIndex
    );
    
    elements.nextLevelText.textContent = `距离${getNextRealmText()}还需: ${Math.max(0, expToNextLevel - state.currentExp).toFixed(2)} 经验`;
    
    // 更新经验条
    if (elements.expProgress && elements.expText && elements.expPercentage) {
        const percentage = Math.min(100, (state.currentExp / expToNextLevel) * 100);
        elements.expProgress.style.width = `${percentage}%`;
        elements.expText.textContent = `${state.currentExp.toFixed(2)}/${expToNextLevel.toFixed(2)}`;
        elements.expPercentage.textContent = `${percentage.toFixed(2)}%`;
    }
}

// 升级处理
function levelUp() {
    const expToNextLevel = calculateExpToNextLevel(
        state.cultivation.realmIndex,
        state.cultivation.stageIndex,
        state.cultivation.levelIndex
    );
    
    state.currentExp -= expToNextLevel;
    
    // 保存当前境界信息用于判断突破类型
    const prevRealmIndex = state.cultivation.realmIndex;
    const prevStageIndex = state.cultivation.stageIndex;
    
    // 升级逻辑
    state.cultivation.levelIndex += 1;
    
    // 检查是否需要提升层
    if (state.cultivation.levelIndex >= 10) {
        state.cultivation.levelIndex = 0;
        state.cultivation.stageIndex += 1;
        
        // 检查是否需要提升大境界
        if (state.cultivation.stageIndex >= 30) {
            state.cultivation.stageIndex = 0;
            state.cultivation.realmIndex += 1;
            
            // 突破大境界，获得50技能点
            state.skillPoints += 50;
        } else {
            // 突破层，获得5技能点
            state.skillPoints += 5;
        }
    }
    
    // 确保技能对象存在
    if (!state.skills) state.skills = {};
    if (!state.skills.experienceIntuition) state.skills.experienceIntuition = { level: 0, unlocked: false };
    if (!state.skills.experienceBoost) state.skills.experienceBoost = { level: 0, unlocked: false };
    if (!state.skills.taskSpecialization) state.skills.taskSpecialization = { level: 0, unlocked: false };
    
    // 检查是否解锁了经验直觉技能
    if (!state.skills.experienceIntuition.unlocked && getTotalLevel() >= 301) {
        state.skills.experienceIntuition.unlocked = true;
    }
    
    // 检查是否解锁了经验增幅技能
    const hasExpIntuitionLevel5 = state.skills.experienceIntuition.unlocked && state.skills.experienceIntuition.level >= 5;
    const isAtFoundationStage = getTotalLevel() >= 301;
    const isAtMiddleFoundationStage = getTotalLevel() >= 401; // 假设筑基期中阶对应401级
    
    if (!state.skills.experienceBoost.unlocked && hasExpIntuitionLevel5 && isAtFoundationStage) {
        state.skills.experienceBoost.unlocked = true;
    }
    
    // 检查是否解锁了任务专精技能
    if (!state.skills.taskSpecialization.unlocked && hasExpIntuitionLevel5 && isAtMiddleFoundationStage) {
        state.skills.taskSpecialization.unlocked = true;
    }
    
    // 显示升级提示
    let message = `恭喜！你已突破至${getCurrentRealmText()}！`;
    
    // 如果获得了技能点，添加到消息中
    if (state.cultivation.stageIndex === 0 && state.cultivation.levelIndex === 0) {
        message += `\n突破大境界！获得50技能点！`;
    } else if (state.cultivation.levelIndex === 0) {
        // 检查是否是突破阶
        if (state.cultivation.stageIndex % 10 === 0) {
            const stageRank = Math.floor(state.cultivation.stageIndex / 10);
            const rankText = ['下', '中', '上'][stageRank];
            message += `\n突破${rankText}阶！获得5技能点！`;
        } else {
            message += `\n突破一层！获得5技能点！`;
        }
    }
    
    // 如果解锁了新技能，添加到消息中
    if (state.skills.experienceIntuition.unlocked && state.skills.experienceIntuition.level === 0) {
        message += `\n恭喜！解锁了新技能「经验直觉」！`;
    }
    if (state.skills.experienceBoost.unlocked && state.skills.experienceBoost.level === 0) {
        message += `\n恭喜！解锁了新技能「经验增幅」！`;
    }
    if (state.skills.taskSpecialization.unlocked && state.skills.taskSpecialization.level === 0) {
        message += `\n恭喜！解锁了新技能「任务专精」！`;
    }
    
    elements.levelUpMessage.textContent = message;
    elements.levelUpModal.style.display = 'flex';
    
    // 递归检查是否可以连续升级
    const newExpToNextLevel = calculateExpToNextLevel(
        state.cultivation.realmIndex,
        state.cultivation.stageIndex,
        state.cultivation.levelIndex
    );
    
    if (state.currentExp >= newExpToNextLevel) {
        levelUp();
    }
}

// 计算经验直觉技能的加成
function calculateExpBonus(baseAmount) {
    if (!state.skills.experienceIntuition.unlocked || state.skills.experienceIntuition.level === 0) {
        return baseAmount;
    }
    
    // 每级提供3%的加成，基础加成3%
    const bonusPercentage = 3 + (state.skills.experienceIntuition.level - 1) * 3;
    const bonusAmount = baseAmount * (bonusPercentage / 100);
    
    console.log(`经验直觉加成: +${bonusPercentage}% (+${bonusAmount.toFixed(1)}经验)`);
    
    return baseAmount + bonusAmount;
}

// 获得经验值
function gainExp(amount, difficulty = 'normal') {
    let actualAmount = amount;
    
    // 对正经验值应用经验直觉技能加成
    if (amount > 0) {
        actualAmount = calculateExpBonus(amount);
        
        // 确保技能对象存在
        if (!state.skills) state.skills = {};
        if (!state.skills.experienceBoost) state.skills.experienceBoost = { level: 0, unlocked: false };
        if (!state.skills.taskSpecialization) state.skills.taskSpecialization = { level: 0, unlocked: false };
        
        // 应用经验增幅技能（经验暴击）
        if (state.skills.experienceBoost.unlocked && state.skills.experienceBoost.level > 0) {
            const criticalProbability = state.skills.experienceBoost.level;
            if (Math.random() * 100 < criticalProbability) {
                // 触发经验暴击
                actualAmount *= 2;
                showExperienceCriticalEffect();
            }
        }
        
        // 应用任务专精技能加成
        if (state.skills.taskSpecialization.unlocked && state.skills.taskSpecialization.level > 0) {
            let baseBonus = 0;
            let perLevelBonus = 0;
            
            // 根据难度设置基础加成和每级加成
            if (difficulty === 'easy') {
                baseBonus = 3;      // 简单任务基础3%
                perLevelBonus = 1;  // 每级额外1%
            } else if (difficulty === 'hard') {
                baseBonus = 12;     // 困难任务基础12%
                perLevelBonus = 3;  // 每级额外3%
            } else {
                baseBonus = 7;      // 普通任务基础7%
                perLevelBonus = 2;  // 每级额外2%
            }
            
            // 计算总加成百分比
            const bonusPercentage = baseBonus + (state.skills.taskSpecialization.level - 1) * perLevelBonus;
            const bonusAmount = actualAmount * (bonusPercentage / 100);
            
            console.log(`任务专精加成: +${bonusPercentage}% (+${bonusAmount.toFixed(1)}经验)`);
            actualAmount += bonusAmount;
        }
    }
    
    console.log(`获得经验: ${amount}${amount > 0 ? ` (实际${actualAmount.toFixed(1)})` : ''}`);
    
    // 处理负经验值（降级）
    if (amount < 0) {
        // 记录原始状态用于调试
        const originalState = { ...state.cultivation };
        
        // 直接调整总经验值
        state.totalExp = Math.max(0, state.totalExp + amount);
        
        // 调整当前经验值
        state.currentExp += amount;
        
        // 如果当前经验值不足以维持当前等级，需要降级
        while (state.currentExp < 0) {
            console.log('执行降级');
            
            // 计算当前等级所需的总经验
            const currentLevelExp = calculateExpToNextLevel(
                state.cultivation.realmIndex,
                state.cultivation.stageIndex,
                state.cultivation.levelIndex
            );
            
            // 保存当前的负经验值
            const remainingNegativeExp = state.currentExp;
            
            // 检查是否需要降低等级
            if (state.cultivation.levelIndex > 0) {
                // 降低一个等级
                state.cultivation.levelIndex--;
                
                // 获取上一级所需的经验值
                const prevLevelExp = calculateExpToNextLevel(
                    state.cultivation.realmIndex,
                    state.cultivation.stageIndex,
                    state.cultivation.levelIndex
                );
                
                // 设置当前经验值为上一级的满值加上剩余的负经验值
                // 这样可以正确处理跨多级降级
                state.currentExp = Number((prevLevelExp + remainingNegativeExp).toFixed(2));
            } else if (state.cultivation.stageIndex > 0) {
                // 降低一个小境界
                state.cultivation.stageIndex--;
                state.cultivation.levelIndex = 9; // 降到该小境界的最高级
                
                // 获取上一小境界最高级所需的经验值
                const prevStageExp = calculateExpToNextLevel(
                    state.cultivation.realmIndex,
                    state.cultivation.stageIndex,
                    state.cultivation.levelIndex
                );
                
                // 设置当前经验值
                state.currentExp = Number((prevStageExp + remainingNegativeExp).toFixed(2));
            } else if (state.cultivation.realmIndex > 0) {
                // 降低一个大境界
                state.cultivation.realmIndex--;
                state.cultivation.stageIndex = 9;
                state.cultivation.levelIndex = 9;
                
                // 获取上一大境界最高级所需的经验值
                const prevRealmExp = calculateExpToNextLevel(
                    state.cultivation.realmIndex,
                    state.cultivation.stageIndex,
                    state.cultivation.levelIndex
                );
                
                // 设置当前经验值
                state.currentExp = Number((prevRealmExp + remainingNegativeExp).toFixed(2));
            } else {
                // 已经是最低境界，不能再降级
                state.currentExp = 0;
                break;
            }
        }
        
        console.log(`降级完成: ${originalState.realmIndex}-${originalState.stageIndex}-${originalState.levelIndex} -> ${state.cultivation.realmIndex}-${state.cultivation.stageIndex}-${state.cultivation.levelIndex}`);
    } else {
        // 正常升级逻辑
        state.currentExp = Number((state.currentExp + actualAmount).toFixed(2));
        state.totalExp = Number((state.totalExp + actualAmount).toFixed(2));
        
        const expToNextLevel = calculateExpToNextLevel(
            state.cultivation.realmIndex,
            state.cultivation.stageIndex,
            state.cultivation.levelIndex
        );
        
        // 检查是否可以升级
        if (state.currentExp >= expToNextLevel) {
            levelUp();
        }
    }
    
    // 更新总等级
    getTotalLevel();
    
    saveState();
    updateCultivationUI();
}

// 保存状态到本地存储
function saveState() {
    // 确保经验值在保存前格式化为两位小数
    const stateToSave = {...state};
    stateToSave.currentExp = Number(state.currentExp.toFixed(2));
    stateToSave.totalExp = Number(state.totalExp.toFixed(2));
    
    localStorage.setItem('cultivationState', JSON.stringify(stateToSave));
    console.log('数据已保存到本地存储 (localStorage) 中的 cultivationState 键');
}

// 从本地存储加载状态
function loadState() {
    const savedState = localStorage.getItem('cultivationState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // 确保经验值在加载时格式化为两位小数
        if (parsedState.currentExp !== undefined) {
            parsedState.currentExp = Number(parseFloat(parsedState.currentExp).toFixed(2));
        }
        if (parsedState.totalExp !== undefined) {
            parsedState.totalExp = Number(parseFloat(parsedState.totalExp).toFixed(2));
        }
        
        Object.assign(state, parsedState);
        
        // 确保数组存在
        if (!state.tasks) state.tasks = [];
        if (!state.events) state.events = [];
        
        // 确保技能系统存在且完整
        if (!state.skills) {
            state.skills = {};
        }
        
        // 确保每个技能都存在且有正确的结构
        const requiredSkills = ['experienceIntuition', 'experienceBoost', 'taskSpecialization'];
        for (const skillType of requiredSkills) {
            if (!state.skills[skillType]) {
                state.skills[skillType] = {
                    level: 0,
                    unlocked: false
                };
            } else {
                // 确保每个技能都有必要的属性
                if (typeof state.skills[skillType].level === 'undefined') {
                    state.skills[skillType].level = 0;
                }
                if (typeof state.skills[skillType].unlocked === 'undefined') {
                    state.skills[skillType].unlocked = false;
                }
            }
        }
        
        // 如果加载的状态中没有totalLevel，计算并添加它
        if (typeof state.totalLevel === 'undefined') {
            getTotalLevel();
        }
    }
}

// 渲染任务列表
function renderTasks(filter = 'all') {
    elements.taskList.innerHTML = '';
    
    let filteredTasks = state.tasks;
    if (filter === 'pending') {
        filteredTasks = state.tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = state.tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = filter === 'all' ? '还没有任务，添加一个开始修行吧！' : 
                               filter === 'pending' ? '没有未完成的任务，继续保持！' : '还没有完成的任务，加油！';
        elements.taskList.appendChild(emptyState);
        return;
    }
    
    // 按完成状态、进行中状态和创建时间排序
    filteredTasks.sort((a, b) => {
        // 进行中的任务排在最前面
        if (a.inProgress !== b.inProgress) {
            return a.inProgress ? -1 : 1;
        }
        // 未完成的任务排在前面
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        // 按创建时间倒序
        return b.createdAt - a.createdAt;
    });
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''} ${task.inProgress ? 'in-progress' : ''}`;
        taskElement.dataset.id = task.id;
        
        // 任务类型标签
        const taskTypeTag = document.createElement('span');
        taskTypeTag.className = `task-type-tag ${task.type || 'normal'}`;
        taskTypeTag.textContent = task.type === 'timer' ? '计时' : '普通';
        
        // 难度标签
        const difficultyTag = document.createElement('span');
        difficultyTag.className = `difficulty-tag difficulty-${task.difficulty || 'normal'}`;
        
        // 根据难度设置标签文本
        if (task.difficulty === 'easy') {
            difficultyTag.textContent = '简单';
        } else if (task.difficulty === 'hard') {
            difficultyTag.textContent = '困难';
        } else {
            difficultyTag.textContent = '普通';
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        // 经验值显示
        const taskExp = document.createElement('span');
        taskExp.className = 'task-exp';
        
        if (task.type === 'timer') {
            taskExp.textContent = `+${task.expValue} 经验 (${task.expPerMinute}/分钟 × ${task.duration}分钟)`;
        } else {
            taskExp.textContent = `+${task.expValue} 经验`;
        }
        
        // 计时任务特殊显示
        let timerDisplay = null;
        if (task.type === 'timer') {
            timerDisplay = document.createElement('div');
            timerDisplay.className = 'timer-display';
            
            if (task.inProgress && task.startTime) {
                const elapsedTime = (Date.now() - task.startTime) + task.pausedTime;
                const minutes = Math.floor(elapsedTime / (1000 * 60));
                const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
                timerDisplay.textContent = `已进行: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} / ${task.duration}分钟`;
            } else if (task.pausedTime > 0) {
                const pausedMinutes = Math.floor(task.pausedTime / (1000 * 60));
                const pausedSeconds = Math.floor((task.pausedTime % (1000 * 60)) / 1000);
                timerDisplay.textContent = `已暂停: ${pausedMinutes.toString().padStart(2, '0')}:${pausedSeconds.toString().padStart(2, '0')} / ${task.duration}分钟`;
            } else {
                timerDisplay.textContent = `目标时长: ${task.duration}分钟`;
            }
            
            // 启动定时器更新显示
            if (task.inProgress) {
                requestAnimationFrame(() => updateTimerDisplay(task.id));
            }
        }
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        // 计时任务的控制按钮
        if (task.type === 'timer' && !task.completed) {
            const controlBtn = document.createElement('button');
            controlBtn.className = task.inProgress ? 'pause-btn' : 'start-btn';
            controlBtn.textContent = task.inProgress ? '暂停' : '开始';
            controlBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTaskCompletion(task.id);
            });
            taskActions.appendChild(controlBtn);
            
            if (task.pausedTime > 0 && !task.completed) {
                const completeBtn = document.createElement('button');
                completeBtn.className = 'complete-btn';
                completeBtn.textContent = '完成';
                completeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    completeTimerTask(task);
                });
                taskActions.appendChild(completeBtn);
            }
            
            if (task.pausedTime > 0 && !task.completed) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel-btn';
                cancelBtn.textContent = '取消';
                cancelBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    cancelTimerTask(task.id);
                });
                taskActions.appendChild(cancelBtn);
            }
        }
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '修改';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editTask(task.id);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        // 添加元素到任务项
        taskElement.appendChild(taskTypeTag);
        taskElement.appendChild(difficultyTag);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskText);
        taskElement.appendChild(taskExp);
        if (timerDisplay) {
            taskElement.appendChild(timerDisplay);
        }
        taskElement.appendChild(taskActions);
        
        elements.taskList.appendChild(taskElement);
    });
}

// 渲染大事件列表
function renderEvents() {
    elements.eventList.innerHTML = '';
    
    if (state.events.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = '还没有记录大事件，添加一个记录你的修仙历程吧！';
        elements.eventList.appendChild(emptyState);
        return;
    }
    
    // 按创建时间倒序排列（最新的在前）
    const sortedEvents = [...state.events].sort((a, b) => b.createdAt - a.createdAt);
    
    sortedEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.dataset.id = event.id;
        
        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        eventTitle.textContent = event.title;
        
        const eventContent = document.createElement('div');
        eventContent.className = 'event-content';
        eventContent.textContent = event.content;
        
        const eventDate = document.createElement('div');
        eventDate.className = 'event-date';
        eventDate.textContent = new Date(event.createdAt).toLocaleString();
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'event-delete-btn';
        deleteBtn.textContent = '删除记录';
        deleteBtn.addEventListener('click', () => deleteEvent(event.id));
        
        eventElement.appendChild(eventTitle);
        eventElement.appendChild(eventContent);
        eventElement.appendChild(eventDate);
        eventElement.appendChild(deleteBtn);
        
        elements.eventList.appendChild(eventElement);
    });
}

// 添加任务
function addTask() {
    const text = elements.taskInput.value.trim();
    
    // 获取任务类型
    const taskType = document.querySelector('input[name="task-type"]:checked').value;
    
    let expValue = 0;
    let duration = 0;
    let expPerMinute = 0;
    
    if (taskType === 'normal') {
        expValue = parseInt(elements.taskExpInput.value.trim()) || 0;
        if (text === '' || expValue <= 0) {
            alert('请输入任务内容和有效的经验值！');
            return;
        }
    } else {
        // 计时任务
        duration = parseInt(elements.taskDurationInput.value.trim()) || 0;
        expPerMinute = parseInt(elements.taskExpPerMinuteInput.value.trim()) || 0;
        
        if (text === '' || duration <= 0 || expPerMinute <= 0) {
            alert('请输入任务内容、有效的时长和每分钟经验值！');
            return;
        }
        
        // 计算总经验值
        expValue = duration * expPerMinute;
    }
    
    // 获取选中的任务难度
    const difficulty = document.querySelector('.difficulty-btn.active').dataset.value;
    
    const newTask = {
        id: Date.now(),
        text,
        type: taskType,
        difficulty,
        expValue,
        duration,
        expPerMinute,
        completed: false,
        inProgress: false,
        startTime: null,
        pausedTime: 0,
        createdAt: Date.now()
    };
    
    state.tasks.push(newTask);
    
    // 清空输入框
    elements.taskInput.value = '';
    if (taskType === 'normal') {
        elements.taskExpInput.value = '';
    } else {
        elements.taskDurationInput.value = '';
        elements.taskExpPerMinuteInput.value = '';
    }
    
    saveState();
    renderTasks(getActiveFilter());
}

// 切换任务完成状态
function toggleTaskCompletion(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const wasCompleted = task.completed;
    
    // 处理计时任务的特殊逻辑
    if (task.type === 'timer') {
        if (task.inProgress) {
            // 暂停计时任务
            pauseTimerTask(task);
        } else if (!task.completed) {
            // 开始计时任务
            startTimerTask(task);
        }
        return;
    }
    
    // 普通任务逻辑
    task.completed = !task.completed;
    
    if (!wasCompleted && task.completed) {
        // 完成任务获得经验值
        gainExp(task.expValue, task.difficulty);
    } else if (wasCompleted && !task.completed) {
        // 取消完成任务，扣除带有加成的实际经验值
        // 重新计算完整的加成（包括经验直觉和任务专精）
        let actualExpGained = calculateExpBonus(task.expValue);
        
        // 计算任务专精加成
        if (state.skills.taskSpecialization.unlocked && state.skills.taskSpecialization.level > 0) {
            let baseBonus = 0;
            let perLevelBonus = 0;
            
            if (task.difficulty === 'easy') {
                baseBonus = 3;
                perLevelBonus = 1;
            } else if (task.difficulty === 'hard') {
                baseBonus = 12;
                perLevelBonus = 3;
            } else {
                baseBonus = 7;
                perLevelBonus = 2;
            }
            
            const bonusPercentage = baseBonus + (state.skills.taskSpecialization.level - 1) * perLevelBonus;
            actualExpGained += actualExpGained * (bonusPercentage / 100);
        }
        
        gainExp(-actualExpGained, task.difficulty);
    }
    
    saveState();
    updateCultivationUI();
    renderTasks(getActiveFilter());
}

// 开始计时任务
function startTimerTask(task) {
    task.inProgress = true;
    task.startTime = Date.now();
    saveState();
    renderTasks(getActiveFilter());
    
    // 设置定时器更新UI
    updateTimerDisplay(task.id);
}

// 暂停计时任务
function pauseTimerTask(task) {
    if (!task.inProgress || !task.startTime) return;
    
    // 计算已进行的时间
    const elapsedTime = Date.now() - task.startTime;
    task.pausedTime += elapsedTime;
    task.inProgress = false;
    task.startTime = null;
    
    // 检查是否达到目标时长
    const totalElapsedMinutes = task.pausedTime / (1000 * 60);
    if (totalElapsedMinutes >= task.duration) {
        completeTimerTask(task);
    }
    
    saveState();
    renderTasks(getActiveFilter());
}

// 完成计时任务
function completeTimerTask(task) {
    task.completed = true;
    task.inProgress = false;
    
    // 如果任务正在进行中，计算从开始到现在的时间并加到pausedTime中
    if (task.startTime) {
        const elapsedTime = Date.now() - task.startTime;
        task.pausedTime += elapsedTime;
        task.startTime = null;
    }
    
    // 计算实际获得的经验值（基于实际时长，但不超过预期）
    const actualMinutes = Math.min(task.duration, task.pausedTime / (1000 * 60));
    const actualExp = Math.floor(actualMinutes * task.expPerMinute);
    
    gainExp(actualExp, task.difficulty);
    saveState();
    updateCultivationUI();
    renderTasks(getActiveFilter());
}

// 取消计时任务
function cancelTimerTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || task.type !== 'timer') return;
    
    if (task.inProgress) {
        task.inProgress = false;
        task.startTime = null;
    }
    
    saveState();
    renderTasks(getActiveFilter());
}

// 更新计时器显示
function updateTimerDisplay(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !task.inProgress || !task.startTime) return;
    
    const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
    if (!taskElement) return;
    
    const timerDisplay = taskElement.querySelector('.timer-display');
    if (!timerDisplay) return;
    
    // 计算已进行的时间
    const elapsedTime = (Date.now() - task.startTime) + task.pausedTime;
    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    
    timerDisplay.textContent = `已进行: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} / ${task.duration}分钟`;
    
    // 如果还在进行中，继续更新
    if (task.inProgress) {
        requestAnimationFrame(() => updateTimerDisplay(taskId));
    }
}

// 修改任务
function editTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    elements.editTaskInput.value = task.text;
    
    // 根据任务类型设置不同的输入
    if (task.type === 'timer') {
        // 显示计时任务相关的编辑字段
        // 注意：这里简化处理，实际可能需要更复杂的模态框
        elements.editExpInput.placeholder = '总经验值';
        elements.editExpInput.value = task.expValue;
    } else {
        elements.editExpInput.placeholder = '经验值';
        elements.editExpInput.value = task.expValue;
    }
    
    // 保存当前任务的难度，用于后续保存
    editingTaskDifficulty = task.difficulty || 'normal';
    
    elements.editModal.style.display = 'flex';
}

// 保存修改的任务
function saveEditedTask() {
    if (editingTaskId === null) return;
    
    const task = state.tasks.find(t => t.id === editingTaskId);
    if (!task) return;
    
    const newText = elements.editTaskInput.value.trim();
    const newExpValue = parseInt(elements.editExpInput.value.trim()) || 0;
    
    if (newText === '' || newExpValue <= 0) {
        alert('请输入任务内容和有效的经验值！');
        return;
    }
    
    // 如果任务已完成且经验值发生变化，需要调整总经验
    if (task.completed && newExpValue !== task.expValue) {
        // 计算新旧经验值的差异（考虑加成）
        const oldActualExp = calculateExpBonus(task.expValue);
        const newActualExp = calculateExpBonus(newExpValue);
        const expDiff = newActualExp - oldActualExp;
        
        // 使用gainExp函数处理经验值变化，确保正确处理升级和降级
        gainExp(expDiff, task.difficulty);
    }
    
    task.text = newText;
    task.expValue = newExpValue;
    // 保留任务难度信息
    task.difficulty = editingTaskDifficulty;
    
    // 对于计时任务，更新计算相关的值
    if (task.type === 'timer') {
        // 保持原来的时长和每分钟经验值比例
        if (task.duration > 0) {
            task.expPerMinute = Math.floor(newExpValue / task.duration);
        }
    }
    
    closeEditModal();
    saveState();
    renderTasks(getActiveFilter());
    updateCultivationUI();
}

// 关闭编辑模态框
function closeEditModal() {
    elements.editModal.style.display = 'none';
    editingTaskId = null;
    elements.editTaskInput.value = '';
    elements.editExpInput.value = '';
}

// 删除任务
function deleteTask(taskId) {
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = state.tasks[taskIndex];
    
    // 如果任务已完成，需要扣除经验值
    if (task.completed) {
        // 计算实际获得的经验值（包括加成）
        const actualExpGained = calculateExpBonus(task.expValue);
        // 扣除带有加成的实际经验值
        gainExp(-actualExpGained);
    }
    
    state.tasks.splice(taskIndex, 1);
    saveState();
    renderTasks(getActiveFilter());
}

// 添加大事件
function addEvent() {
    const title = elements.eventTitleInput.value.trim();
    const content = elements.eventContentInput.value.trim();
    
    if (title === '' || content === '') {
        alert('请输入事件标题和内容！');
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        title,
        content,
        createdAt: Date.now()
    };
    
    state.events.push(newEvent);
    elements.eventTitleInput.value = '';
    elements.eventContentInput.value = '';
    
    saveState();
    renderEvents();
}

// 删除大事件
function deleteEvent(eventId) {
    const eventIndex = state.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;
    
    state.events.splice(eventIndex, 1);
    saveState();
    renderEvents();
}

// 计算技能升级所需点数
function calculateSkillUpgradeCost(skillType, currentLevel) {
    // 经验直觉技能的升级消耗规则：1/2/3/4/5/5/5之后都是5
    if (skillType === 'experienceIntuition') {
        return currentLevel < 4 ? currentLevel + 1 : 5;
    }
    // 经验增幅技能的升级消耗规则：1/2/3/4/5/5之后都是5
    else if (skillType === 'experienceBoost') {
        return currentLevel < 4 ? currentLevel + 1 : 5;
    }
    // 任务专精技能的升级消耗规则：3/6/9/12/15/15/15/15/15/20
    else if (skillType === 'taskSpecialization') {
        const costs = [3, 6, 9, 12, 15, 15, 15, 15, 15, 20];
        return costs[currentLevel] || 20;
    }
    return 1;
}

// 升级技能
function upgradeSkill(skillType) {
    const skill = state.skills[skillType];
    
    if (!skill) {
        console.error('技能不存在:', skillType);
        return false;
    }
    
    // 检查技能是否已解锁
    if (!skill.unlocked) {
        alert('该技能尚未解锁！');
        return false;
    }
    
    // 计算升级所需的技能点
    const upgradeCost = calculateSkillUpgradeCost(skillType, skill.level);
    
    // 检查技能点是否足够
    if (state.skillPoints < upgradeCost) {
        alert(`技能点不足！需要${upgradeCost}点，当前剩余${state.skillPoints}点。`);
        return false;
    }
    
    // 扣除技能点
    state.skillPoints -= upgradeCost;
    
    // 提升技能等级
    skill.level += 1;
    
    // 保存状态
    saveState();
    
    // 更新技能UI
    updateSkillsUI();
    
    return true;
}

// 显示经验暴击效果
function showExperienceCriticalEffect() {
    // 创建经验暴击提示元素
    const criticalElement = document.createElement('div');
    criticalElement.className = 'experience-critical-effect';
    criticalElement.textContent = '经验暴击！';
    
    // 添加到页面
    document.body.appendChild(criticalElement);
    
    // 添加CSS类触发动画
    setTimeout(() => {
        criticalElement.classList.add('active');
    }, 10);
    
    // 动画结束后移除元素
    setTimeout(() => {
        criticalElement.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(criticalElement)) {
                document.body.removeChild(criticalElement);
            }
        }, 300);
    }, 1500);
}

// 更新技能UI
function updateSkillsUI() {
    const skillPointsElement = document.getElementById('skill-points');
    
    // 经验直觉技能相关元素
    const expIntuitionLevelElement = document.getElementById('exp-intuition-level');
    const expIntuitionBonusElement = document.getElementById('exp-intuition-bonus');
    const expIntuitionCostElement = document.getElementById('exp-intuition-cost');
    const upgradeExpIntuitionBtn = document.getElementById('upgrade-exp-intuition');
    
    // 经验增幅技能相关元素
    const expBoostLevelElement = document.getElementById('exp-boost-level');
    const expBoostProbabilityElement = document.getElementById('exp-boost-probability');
    const expBoostCostElement = document.getElementById('exp-boost-cost');
    const upgradeExpBoostBtn = document.getElementById('upgrade-exp-boost');
    const expBoostUnlockInfo = document.getElementById('exp-boost-unlock-info');
    
    // 任务专精技能相关元素
    const taskSpecLevelElement = document.getElementById('task-spec-level');
    const taskSpecEasyBonusElement = document.getElementById('task-spec-easy-bonus');
    const taskSpecNormalBonusElement = document.getElementById('task-spec-normal-bonus');
    const taskSpecHardBonusElement = document.getElementById('task-spec-hard-bonus');
    const taskSpecCostElement = document.getElementById('task-spec-cost');
    const upgradeTaskSpecBtn = document.getElementById('upgrade-task-spec');
    const taskSpecUnlockInfo = document.getElementById('task-spec-unlock-info');
    
    // 更新剩余技能点
    if (skillPointsElement) {
        skillPointsElement.textContent = state.skillPoints;
    }
    
    // 更新经验直觉技能信息
    if (expIntuitionLevelElement && expIntuitionBonusElement && 
        expIntuitionCostElement && upgradeExpIntuitionBtn && 
        state.skills && state.skills.experienceIntuition) {
        
        const skill = state.skills.experienceIntuition;
        
        // 显示技能等级
        expIntuitionLevelElement.textContent = skill.level;
        
        // 显示经验加成
        const bonusPercentage = skill.level * 3;
        expIntuitionBonusElement.textContent = `${bonusPercentage}%`;
        
        // 计算并显示升级消耗
        const upgradeCost = calculateSkillUpgradeCost('experienceIntuition', skill.level);
        expIntuitionCostElement.textContent = upgradeCost;
        
        // 禁用/启用升级按钮
        if (!skill.unlocked || state.skillPoints < upgradeCost) {
            upgradeExpIntuitionBtn.disabled = true;
        } else {
            upgradeExpIntuitionBtn.disabled = false;
        }
    }
    
    // 更新经验增幅技能信息
    if (expBoostLevelElement && expBoostProbabilityElement && 
        expBoostCostElement && upgradeExpBoostBtn && expBoostUnlockInfo && 
        state.skills && state.skills.experienceBoost) {
        
        const skill = state.skills.experienceBoost;
        
        // 检查解锁条件并自动解锁
        if (!skill.unlocked) {
            const hasExpIntuitionLevel5 = state.skills.experienceIntuition.unlocked && state.skills.experienceIntuition.level >= 5;
            const isAtFoundationStage = getTotalLevel() >= 301;
            
            // 当所有条件满足时，自动解锁技能
            if (hasExpIntuitionLevel5 && isAtFoundationStage) {
                skill.unlocked = true;
                // 可以添加一个提示，告知用户技能已解锁
                alert('恭喜！经验增幅技能已解锁！');
            }
        }
        
        // 显示解锁信息
        if (!skill.unlocked) {
            // 检查解锁条件
            const hasExpIntuitionLevel5 = state.skills.experienceIntuition.unlocked && state.skills.experienceIntuition.level >= 5;
            const isAtFoundationStage = getTotalLevel() >= 301;
            
            let unlockText = [];
            if (!hasExpIntuitionLevel5) unlockText.push('经验直觉至少5级');
            if (!isAtFoundationStage) unlockText.push('达到筑基期');
            
            expBoostUnlockInfo.textContent = unlockText.join(' ');
            expBoostUnlockInfo.style.display = 'inline';
        } else {
            expBoostUnlockInfo.style.display = 'none';
        }
        
        // 显示技能等级
        expBoostLevelElement.textContent = skill.level;
        
        // 显示暴击概率
        const criticalProbability = skill.level;
        expBoostProbabilityElement.textContent = `${criticalProbability}%`;
        
        // 计算并显示升级消耗
        const upgradeCost = calculateSkillUpgradeCost('experienceBoost', skill.level);
        expBoostCostElement.textContent = upgradeCost;
        
        // 禁用/启用升级按钮
        if (!skill.unlocked || state.skillPoints < upgradeCost || skill.level >= 100) {
            upgradeExpBoostBtn.disabled = true;
        } else {
            upgradeExpBoostBtn.disabled = false;
        }
    }
    
    // 更新任务专精技能信息
    if (taskSpecLevelElement && taskSpecEasyBonusElement && taskSpecNormalBonusElement && 
        taskSpecHardBonusElement && taskSpecCostElement && upgradeTaskSpecBtn && taskSpecUnlockInfo && 
        state.skills && state.skills.taskSpecialization) {
        
        const skill = state.skills.taskSpecialization;
        
        // 检查解锁条件并自动解锁
        if (!skill.unlocked) {
            const hasExpIntuitionLevel5 = state.skills.experienceIntuition.unlocked && state.skills.experienceIntuition.level >= 5;
            const isAtMiddleFoundationStage = getTotalLevel() >= 401; // 假设筑基期中阶对应401级
            
            // 当所有条件满足时，自动解锁技能
            if (hasExpIntuitionLevel5 && isAtMiddleFoundationStage) {
                skill.unlocked = true;
                alert('恭喜！任务专精技能已解锁！');
            }
        }
        
        // 显示解锁信息
        if (!skill.unlocked) {
            // 检查解锁条件
            const hasExpIntuitionLevel5 = state.skills.experienceIntuition.unlocked && state.skills.experienceIntuition.level >= 5;
            const isAtMiddleFoundationStage = getTotalLevel() >= 401;
            
            let unlockText = [];
            if (!hasExpIntuitionLevel5) unlockText.push('经验直觉至少5级');
            if (!isAtMiddleFoundationStage) unlockText.push('达到筑基期中阶');
            
            taskSpecUnlockInfo.textContent = unlockText.join(' ');
            taskSpecUnlockInfo.style.display = 'inline';
        } else {
            taskSpecUnlockInfo.style.display = 'none';
        }
        
        // 显示技能等级
        taskSpecLevelElement.textContent = skill.level;
        
        // 显示不同难度任务的经验加成
        if (skill.level > 0) {
            const easyBonus = 3 + (skill.level - 1) * 1;      // 简单任务：基础3%，每级+1%
            const normalBonus = 7 + (skill.level - 1) * 2;    // 普通任务：基础7%，每级+2%
            const hardBonus = 12 + (skill.level - 1) * 3;     // 困难任务：基础12%，每级+3%
            
            taskSpecEasyBonusElement.textContent = `${easyBonus}%`;
            taskSpecNormalBonusElement.textContent = `${normalBonus}%`;
            taskSpecHardBonusElement.textContent = `${hardBonus}%`;
        } else {
            taskSpecEasyBonusElement.textContent = '0%';
            taskSpecNormalBonusElement.textContent = '0%';
            taskSpecHardBonusElement.textContent = '0%';
        }
        
        // 计算并显示升级消耗
        const upgradeCost = calculateSkillUpgradeCost('taskSpecialization', skill.level);
        taskSpecCostElement.textContent = upgradeCost;
        
        // 禁用/启用升级按钮
        if (!skill.unlocked || state.skillPoints < upgradeCost || skill.level >= 10) {
            upgradeTaskSpecBtn.disabled = true;
        } else {
            upgradeTaskSpecBtn.disabled = false;
        }
    }
}

// 获取当前激活的筛选器
function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

// 切换标签页
function switchTab(tabName) {
    // 更新标签按钮状态
    elements.tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新标签内容显示
    elements.tabContents.forEach(content => {
        if (content.id === `${tabName}-content`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // 如果切换到任务标签，重新渲染任务列表
    if (tabName === 'tasks') {
        renderTasks(getActiveFilter());
    } else if (tabName === 'events') {
        renderEvents();
    } else if (tabName === 'skills') {
        // 如果切换到技能标签，更新技能UI
        updateSkillsUI();
    }
}

// 清除历史数据
function clearHistoryData() {
  if (confirm('确定要清除所有历史数据吗？此操作不可恢复！')) {
    // 清除localStorage中的数据
    localStorage.removeItem('cultivationState');
    
    // 重置状态（由于state是常量，我们需要逐个属性重置）
    state.cultivation.realmIndex = 0;
    state.cultivation.stageIndex = 0;
    state.cultivation.levelIndex = 0;
    state.currentExp = 0;
    state.totalExp = 0;
    state.totalLevel = 1;
    state.tasks = [];
    state.events = [];
    // 重置技能相关数据
    state.skillPoints = 0;
    state.skills.experienceIntuition.level = 0;
    state.skills.experienceIntuition.unlocked = false;
    state.skills.experienceBoost.level = 0;
    state.skills.experienceBoost.unlocked = false;
    state.skills.taskSpecialization.level = 0;
    state.skills.taskSpecialization.unlocked = false;
    
    // 更新UI
    updateCultivationUI();
    renderTasks();
    renderEvents();
    updateSkillsUI();
    
    console.log('历史数据已清除');
    alert('历史数据已成功清除！');
  }
}

// 初始化事件监听器
function initEventListeners() {
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    

    
    // 清除历史数据按钮
    document.getElementById('clear-data').addEventListener('click', clearHistoryData);
    
    // 任务类型切换
    elements.taskTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'normal') {
                elements.normalTaskSection.style.display = 'block';
                elements.timerTaskSection.style.display = 'none';
            } else {
                elements.normalTaskSection.style.display = 'none';
                elements.timerTaskSection.style.display = 'block';
            }
        });
    });
    
    // 任务相关
    elements.addTaskBtn.addEventListener('click', addTask);
    elements.taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // 难度按钮点击事件
    elements.difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的active类
            elements.difficultyButtons.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加active类
            btn.classList.add('active');
        });
    });
    
    // 任务筛选
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 渲染筛选后的任务
            renderTasks(btn.dataset.filter);
        });
    });
    
    // 大事件相关
    elements.addEventBtn.addEventListener('click', addEvent);
    elements.eventTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addEvent();
        }
    });
    
    // 模态框相关
    elements.levelUpClose.addEventListener('click', () => {
        elements.levelUpModal.style.display = 'none';
        updateCultivationUI(); // 确保UI更新
    });
    
    elements.saveEditBtn.addEventListener('click', saveEditedTask);
    elements.cancelEditBtn.addEventListener('click', closeEditModal);
    
    // 技能升级按钮事件监听
    document.getElementById('upgrade-exp-intuition')?.addEventListener('click', () => upgradeSkill('experienceIntuition'));
    document.getElementById('upgrade-exp-boost')?.addEventListener('click', () => upgradeSkill('experienceBoost'));
    document.getElementById('upgrade-task-spec')?.addEventListener('click', () => upgradeSkill('taskSpecialization'));
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === elements.levelUpModal) {
            elements.levelUpModal.style.display = 'none';
            updateCultivationUI();
        }
        if (e.target === elements.editModal) {
            closeEditModal();
        }
    });
}

// 初始化应用
function initApp() {
    loadState();
    updateCultivationUI();
    updateSkillsUI(); // 初始化技能UI
    initEventListeners();
    switchTab('tasks'); // 默认显示任务标签
}

// 启动应用
initApp();