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

// 装备系统配置
const EQUIPMENT_TIERS = [
    { name: '凡品', color: '#8b8b8b' },
    { name: '灵品', color: '#6b8e23' },
    { name: '地品', color: '#4682b4' },
    { name: '天品', color: '#800080' },
    { name: '玄品', color: '#ff8c00' },
    { name: '圣品', color: '#ffd700' },
    { name: '神品', color: '#00ff00' },
    { name: '道品', color: '#00ffff' },
    { name: '混元', color: '#ff00ff' },
    { name: '混沌', color: '#ff4500' }
];

// 装备命名系统 - 为不同类型和品阶的装备设置独特名称
const EQUIPMENT_NAMES = {
    weapon1: [
        '铁剑', '青钢剑', '玄铁剑', '天陨剑', '玄霜剑', 
        '圣剑', '神剑', '道剑', '混元剑', '混沌剑'
    ],
    weapon2: [
        '木棍', '灵杖', '地皇杖', '天罡杖', '玄冥杖', 
        '圣杖', '神杖', '道杖', '混元杖', '混沌杖'
    ],
    face: [
        '粗布巾', '灵纹巾', '地隐面具', '天罗面甲', '玄影面纱', 
        '圣容面具', '神隐面甲', '道隐面具', '混元面具', '混沌面甲'
    ],
    top: [
        '粗布衣', '灵纹衣', '地蚕宝衣', '天蚕神衣', '玄元道袍', 
        '圣道法袍', '神华道衣', '道韵法衣', '混元道袍', '混沌道衣'
    ],
    belt: [
        '布腰带', '灵纹带', '地脉腰带', '天罡腰带', '玄阴腰带', 
        '圣道宝带', '神华玉带', '道韵仙带', '混元天带', '混沌神带'
    ],
    bottom: [
        '粗布裤', '灵纹裤', '地蚕长裤', '天丝宝裤', '玄元道裤', 
        '圣道法裤', '神华道裤', '道韵法裤', '混元道裤', '混沌道裤'
    ],
    shoes: [
        '布鞋', '灵纹鞋', '地行靴', '天云靴', '玄风靴', 
        '圣道云靴', '神行仙靴', '道韵云靴', '混元神靴', '混沌天靴'
    ],
    accessory: [
        '木牌', '灵玉牌', '地灵宝佩', '天灵宝印', '玄阴玉佩', 
        '圣道印鉴', '神华玉佩', '道韵灵佩', '混元灵佩', '混沌神佩'
    ]
};

// 获取装备名称函数
function getEquipmentName(type, tier) {
    const tierIndex = Math.min(tier, EQUIPMENT_TIERS.length - 1);
    if (EQUIPMENT_NAMES[type] && EQUIPMENT_NAMES[type][tierIndex]) {
        // 直接返回装备名称数组中的名称，不再添加品阶前缀
        // 因为我们的装备名称数组中已经包含了品阶和装备类型的完整描述
        return EQUIPMENT_NAMES[type][tierIndex];
    }
    // 备用命名方案
    const typeName = EQUIPMENT_TYPES.find(t => t.id === type)?.name || type;
    return `${EQUIPMENT_TIERS[tierIndex].name}${typeName}`;
}

const EQUIPMENT_TYPES = [
    { id: 'weapon1', name: '武器1', category: 'weapon' },
    { id: 'weapon2', name: '武器2', category: 'weapon' },
    { id: 'face', name: '面部', category: 'armor' },
    { id: 'top', name: '上衣', category: 'armor' },
    { id: 'belt', name: '腰带', category: 'armor' },
    { id: 'bottom', name: '下装', category: 'armor' },
    { id: 'shoes', name: '鞋子', category: 'armor' },
    { id: 'accessory', name: '挂饰', category: 'accessory' }
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
    },
    // 装备系统
    coin: 0,
    equipment: {
        equipped: {}, // 已装备的装备
        inventory: [] // 装备背包
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
            // 立即更新技能点UI显示
            updateSkillsUI();
        } else {
            // 突破层，获得5技能点
            state.skillPoints += 5;
            // 立即更新技能点UI显示
            updateSkillsUI();
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
    
    console.log(`经验直觉加成: +${bonusPercentage.toFixed(2)}% (+${bonusAmount.toFixed(2)}经验)`);
    
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
            
            console.log(`任务专精加成: +${bonusPercentage.toFixed(2)}% (+${bonusAmount.toFixed(2)}经验)`);
            actualAmount += bonusAmount;
        }
    }
    
    console.log(`获得经验: ${amount}${amount > 0 ? ` (实际${actualAmount.toFixed(2)})` : ''}`);
    
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
    
    // 重置铜币
    state.coin = 0;
    
    // 重置装备系统
    if (state.equipment) {
        state.equipment.equipped = {};
        state.equipment.inventory = [];
    }
    
    // 重新创建初始装备（回归到1级凡品）
    createInitialEquipment();
    
    // 更新UI
    updateCultivationUI();
    renderTasks();
    renderEvents();
    updateSkillsUI();
    
    // 更新装备UI
    renderEquipmentSlots();
    renderEquipmentInventory();
    
    // 更新铜币显示
    const coinCountElement = document.getElementById('coin-count');
    if (coinCountElement) {
        coinCountElement.textContent = state.coin;
    }
    
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

// 装备系统DOM元素引用
// 移到initEquipmentSystem函数中，确保DOM元素已经加载完成

// 当前选中的装备
let selectedEquipment = null;

// 查找并修复任务取消函数，添加扣除铜币的逻辑
// 假设任务取消是通过调用带有负经验值的gainExp函数实现的
// 已经在gainExp函数中添加了相应的扣除逻辑 - 现在扣除的是经验值10倍的铜币

// 装备进阶（提升品阶）
function promoteEquipment(equipment) {
    // 检查是否满足进阶条件
    if (equipment.level % 100 !== 0 || equipment.tier >= EQUIPMENT_TIERS.length - 1) {
        return false;
    }
    
    // 进阶消耗（比普通升级高10倍）
    const promotionCost = calculateUpgradeCost(equipment) * 10;
    if (state.coin < promotionCost) {
        return false;
    }
    
    // 扣除铜币
    state.coin -= promotionCost;
    
    // 提升品阶
    equipment.tier += 1;
    // 更新装备名称为新品阶对应的名称
    equipment.name = getEquipmentName(equipment.type, equipment.tier);
    
    // 进阶后等级变为101级
    equipment.level += 1;
    
    // 每次进阶后等级上限增加100
    equipment.maxLevel += 100;
    
    // 初始化effects对象（如果不存在）
    if (!equipment.effects) {
        equipment.effects = {};
    }
    
    // 进阶时添加额外属性加成：当前阶数*10%（第二阶为20%，第三阶为30%，依此类推）
    const bonusAmount = equipment.tier * 10;
    
    // 确保coinBonus属性存在并增加相应加成
    if (!equipment.effects.coinBonus) {
        equipment.effects.coinBonus = 0;
    }
    equipment.effects.coinBonus += bonusAmount;
    
    // 确保expBonus属性存在并增加相应加成
    if (!equipment.effects.expBonus) {
        equipment.effects.expBonus = 1;
    }
    // 保持之前的升级加成逻辑，加上进阶额外加成
    const bonusPerLevel = (equipment.tier) * 0.1;
    equipment.effects.expBonus = (1 + (equipment.level - 1) * bonusPerLevel + bonusAmount).toFixed(2);
    
    // 保存状态
    saveState();
    
    return true;
}

// 创建初始装备
function createInitialEquipment() {
    // 为每个装备类型创建初始装备
    const initialEquipment = [];
    
    EQUIPMENT_TYPES.forEach(type => {
        const equipment = {
            id: `initial-${type.id}-${Date.now()}`,
            name: getEquipmentName(type.id, 0),
            type: type.id,
            category: type.category,
            tier: 0,
            level: 1,
            maxLevel: 1000, // 装备总等级1000级
            effects: {
                expBonus: 1, // 初始加1%经验获取
                coinBonus: 0 // 初始铜币获取加成
            }
        };
        initialEquipment.push(equipment);
        // 直接装备这些初始装备
        state.equipment.equipped[type.id] = equipment;
    });
    
    return initialEquipment;
}

// 计算装备升级所需铜币
function calculateUpgradeCost(equipment) {
    const baseCost = 10;
    const tierMultiplier = Math.pow(1.5, equipment.tier);
    const levelMultiplier = Math.pow(1.03, equipment.level - 1);
    return Math.floor(baseCost * tierMultiplier * levelMultiplier);
}

// 升级装备（单次）
function upgradeEquipmentOnce(equipment) {
    if (equipment.level >= equipment.maxLevel) {
        return false;
    }
    
    const cost = calculateUpgradeCost(equipment);
    if (state.coin < cost) {
        return false;
    }
    
    // 扣除铜币
    state.coin -= cost;
    
    // 升级装备
    equipment.level += 1;
    
    // 提升经验加成效果 - 根据品阶决定每次升级增幅
    // 初始化effects对象（如果不存在）
    if (!equipment.effects) {
        equipment.effects = {};
    }
    
    // 确保coinBonus属性存在
    if (!equipment.effects.coinBonus) {
        equipment.effects.coinBonus = 0;
    }
    
    // 凡品(tier 0)每次+0.1%，第二阶(tier 1)每次+0.2%，以此类推
    const bonusPerLevel = (equipment.tier + 1) * 0.1;
    // 计算基础加成加上进阶带来的额外加成
    const baseBonus = 1 + (equipment.level - 1) * bonusPerLevel;
    const promotionBonus = equipment.effects.coinBonus || 0; // 进阶加成通常在经验和铜币上相同
    equipment.effects.expBonus = (baseBonus + promotionBonus).toFixed(2);
    
    // 确保至少为1%
    if (parseFloat(equipment.effects.expBonus) < 1) {
        equipment.effects.expBonus = "1.00";
    }
    
    // 保存状态
    saveState();
    
    return true;
}

// 批量升级装备（多次）
function upgradeEquipmentMultiple(equipment, levels) {
    if (!equipment || !levels || levels <= 0) return false;
    
    // 计算总消耗
    let totalCost = 0;
    let tempLevel = equipment.level;
    const originalLevel = equipment.level;
    
    for (let i = 0; i < levels; i++) {
        // 检查是否会达到需要进阶的等级
        if ((tempLevel + 1) % 100 === 0) break;
        // 检查是否会超过最大等级
        if (tempLevel >= equipment.maxLevel) break;
        
        // 计算当前等级的升级费用
        const tempEquipment = { ...equipment, level: tempLevel };
        totalCost += calculateUpgradeCost(tempEquipment);
        
        tempLevel++;
    }
    
    // 如果没有实际可升级的等级
    if (tempLevel === originalLevel) return false;
    
    // 检查铜币是否足够
    if (state.coin < totalCost) return false;
    
    // 执行多次升级
    for (let i = 0; i < tempLevel - originalLevel; i++) {
        upgradeEquipmentOnce(equipment);
    }
    
    return true;
}

// 升级装备（兼容原函数调用）
function upgradeEquipment(equipment) {
    return upgradeEquipmentOnce(equipment);
}

// 装备/卸下装备
function toggleEquipment(equipment) {
    const slotType = equipment.type;
    
    // 如果该装备已装备，则卸下
    if (state.equipment.equipped[slotType] && state.equipment.equipped[slotType].id === equipment.id) {
        // 从已装备中移除
        delete state.equipment.equipped[slotType];
        // 添加到背包
        state.equipment.inventory.push(equipment);
        return 'unequipped';
    }
    
    // 如果该槽位已有装备，将其放入背包
    if (state.equipment.equipped[slotType]) {
        const oldEquipment = state.equipment.equipped[slotType];
        // 从背包中移除新装备，添加旧装备
        const newEquipmentIndex = state.equipment.inventory.findIndex(e => e.id === equipment.id);
        if (newEquipmentIndex !== -1) {
            state.equipment.inventory.splice(newEquipmentIndex, 1);
        }
        state.equipment.inventory.push(oldEquipment);
    } else {
        // 从背包中移除装备
        const equipmentIndex = state.equipment.inventory.findIndex(e => e.id === equipment.id);
        if (equipmentIndex !== -1) {
            state.equipment.inventory.splice(equipmentIndex, 1);
        }
    }
    
    // 装备新装备
    state.equipment.equipped[slotType] = equipment;
    return 'equipped';
}

// 删除装备
function deleteEquipment(equipment) {
    // 从背包中移除
    const inventoryIndex = state.equipment.inventory.findIndex(e => e.id === equipment.id);
    if (inventoryIndex !== -1) {
        state.equipment.inventory.splice(inventoryIndex, 1);
        return true;
    }
    
    // 检查是否已装备
    for (const slot in state.equipment.equipped) {
        if (state.equipment.equipped[slot] && state.equipment.equipped[slot].id === equipment.id) {
            delete state.equipment.equipped[slot];
            return true;
        }
    }
    
    return false;
}

// 计算装备总经验加成
function calculateEquipmentExpBonus() {
    let totalBonus = 0;
    
    for (const slot in state.equipment.equipped) {
        const equipment = state.equipment.equipped[slot];
        if (equipment && equipment.effects && equipment.effects.expBonus) {
            totalBonus += parseFloat(equipment.effects.expBonus);
        }
    }
    
    return totalBonus;
}

// 渲染装备槽位
function renderEquipmentSlots() {
    EQUIPMENT_TYPES.forEach(type => {
        const slotElement = document.getElementById(`${type.id}-equipped`);
        const equipment = state.equipment.equipped[type.id];
        
        if (slotElement) {
            if (equipment) {
                // 确保移除之前的事件监听器
                slotElement.onclick = null;
                
                slotElement.className = `equipment-item equipment-tier-${equipment.tier + 1}`;
                slotElement.innerHTML = `
                    <div class="equipment-item-name">${equipment.name}</div>
                    <div class="equipment-item-level">Lv.${equipment.level}</div>
                    <div class="equipment-item-effect">经验+${equipment.effects.expBonus}%</div>
                    ${parseFloat(equipment.effects.coinBonus) > 0 ? `<div class="equipment-item-effect">铜币+${equipment.effects.coinBonus}%</div>` : ''}
                `;
                // 使用闭包确保正确的equipment引用
                const currentEquipment = equipment;
                slotElement.onclick = function() {
                    showEquipmentDetail(currentEquipment);
                };
            } else {
                slotElement.className = 'equipment-item empty';
                slotElement.innerHTML = '<span class="empty-text">未装备</span>';
                slotElement.onclick = null;
            }
        }
    });
}

// 渲染装备背包
function renderEquipmentInventory(filter = 'all') {
    // 直接获取元素，避免依赖equipmentElements对象
    const inventoryElement = document.getElementById('equipment-inventory');
    if (!inventoryElement) return;
    
    inventoryElement.innerHTML = '';
    
    let filteredEquipment = state.equipment.inventory;
    
    if (filter !== 'all') {
        filteredEquipment = state.equipment.inventory.filter(item => item.category === filter);
    }
    
    filteredEquipment.forEach(equipment => {
        const itemElement = document.createElement('div');
        itemElement.className = `equipment-item equipment-tier-${equipment.tier + 1}`;
        itemElement.innerHTML = `
            <div class="equipment-item-name">${equipment.name}</div>
            <div class="equipment-item-level">Lv.${equipment.level}</div>
            <div class="equipment-item-effect">经验+${equipment.effects.expBonus}%</div>
            ${parseFloat(equipment.effects.coinBonus) > 0 ? `<div class="equipment-item-effect">铜币+${equipment.effects.coinBonus}%</div>` : ''}
        `;
        // 使用闭包确保正确的equipment引用
        const currentEquipment = equipment;
        itemElement.onclick = function() {
            showEquipmentDetail(currentEquipment);
        };
        inventoryElement.appendChild(itemElement);
    });
    
    if (filteredEquipment.length === 0) {
        inventoryElement.innerHTML = '<div class="empty-inventory">背包空空如也</div>';
    }
}

// 显示装备详情
function showEquipmentDetail(equipment) {
    selectedEquipment = equipment;
    
    // 直接获取DOM元素，避免依赖equipmentElements对象
    const modal = document.getElementById('equipment-detail-modal');
    const title = document.getElementById('equipment-detail-title');
    const content = document.getElementById('equipment-detail-content');
    const equipBtn = document.getElementById('equipment-equip-btn');
    const upgradeBtn = document.getElementById('equipment-upgrade-btn');
    
    if (!modal || !title || !content || !equipBtn) return;
    
    title.textContent = equipment.name;
    
    // 检查是否可以进阶
    const canPromote = equipment.level % 100 === 0 && equipment.tier < EQUIPMENT_TIERS.length - 1;
    
    // 准备进阶信息
    let promotionInfo = '';
    if (canPromote) {
        const promotionCost = calculateUpgradeCost(equipment) * 10;
        const hasEnoughCoin = state.coin >= promotionCost;
        promotionInfo = `
        <div class="equipment-promotion-info">
            <button id="equipment-promote-btn" ${!hasEnoughCoin ? 'disabled' : ''}>
                ${hasEnoughCoin ? '进阶' : '铜币不足'}
            </button>
        </div>
        `;
    }
    
    content.innerHTML = `
        <div class="equipment-detail-info">
            <p><strong>类型:</strong> ${EQUIPMENT_TYPES.find(t => t.id === equipment.type).name}</p>
            <p><strong>品阶:</strong> ${EQUIPMENT_TIERS[equipment.tier].name}</p>
            <p><strong>等级:</strong> ${equipment.level}/${equipment.maxLevel}</p>
        </div>
        <div class="equipment-detail-stats">
            <h4>属性</h4>
            <p>经验获取加成: +${equipment.effects.expBonus}%</p>
            ${parseFloat(equipment.effects.coinBonus) > 0 ? `<p>铜币获取加成: +${equipment.effects.coinBonus}%</p>` : ''}
        </div>
        <div class="equipment-upgrade-info">
            <h4>升级信息</h4>
            <p>下一级消耗: ${calculateUpgradeCost(equipment)} 铜币</p>
            <p>下一级效果: ${canPromote ? `进阶到${EQUIPMENT_TIERS[equipment.tier + 1].name}，额外获得经验+${((equipment.tier + 1) * 10).toFixed(0)}%和铜币+${((equipment.tier + 1) * 10).toFixed(0)}%` : `+${(parseFloat(equipment.effects.expBonus) + (equipment.tier + 1) * 0.1).toFixed(2)}% 经验`}</p>
            ${!canPromote && parseFloat(equipment.effects.coinBonus) > 0 ? `<p>铜币加成: +${equipment.effects.coinBonus}%</p>` : ''}
        </div>
        ${promotionInfo}
    `;
    
    // 检查是否已装备
    const isEquipped = state.equipment.equipped[equipment.type] && 
                      state.equipment.equipped[equipment.type].id === equipment.id;
    
    equipBtn.textContent = isEquipped ? '卸下' : '装备';
    
    // 禁用升级按钮（如果达到100级且可以进阶）
    if (upgradeBtn) {
        upgradeBtn.disabled = canPromote;
        upgradeBtn.title = canPromote ? '达到100级，请先进行进阶' : '';
    }
    
    // 添加进阶按钮事件监听
    const promoteBtn = document.getElementById('equipment-promote-btn');
    if (promoteBtn) {
        promoteBtn.addEventListener('click', function() {
            const success = promoteEquipment(equipment);
            if (success) {
                // 更新UI
                renderEquipmentSlots();
                renderEquipmentInventory();
                
                // 更新铜币显示
                const coinCountElement = document.getElementById('coin-count');
                if (coinCountElement) {
                    coinCountElement.textContent = state.coin;
                }
                
                // 重新显示装备详情
                showEquipmentDetail(equipment);
            }
        });
    }
    
    modal.style.display = 'flex';
}

// 显示升级模态框
function showUpgradeModal(equipment) {
    selectedEquipment = equipment;
    
    // 直接获取DOM元素，避免依赖equipmentElements对象
    const modal = document.getElementById('equipment-upgrade-modal');
    const info = document.getElementById('upgrade-equipment-info');
    const cost = document.getElementById('upgrade-coin-cost');
    const result = document.getElementById('upgrade-result');
    const confirmBtn = document.getElementById('confirm-upgrade-btn');
    const confirmUpgrade10Btn = document.getElementById('confirm-upgrade-10-btn');
    
    if (!modal || !info || !cost || !result || !confirmBtn) return;
    
    const upgradeCost = calculateUpgradeCost(equipment);
    const canPromote = equipment.level % 100 === 0 && equipment.tier < EQUIPMENT_TIERS.length - 1;
    const canUpgrade = state.coin >= upgradeCost && equipment.level < equipment.maxLevel && !canPromote;
    
    // 计算升10级的总消耗
    let upgrade10Cost = 0;
    let tempLevel = equipment.level;
    let canUpgrade10 = false;
    let actualLevels = 0;
    
    if (!canPromote && equipment.level < equipment.maxLevel) {
        for (let i = 0; i < 10; i++) {
            // 检查是否会达到需要进阶的等级
            if ((tempLevel + 1) % 100 === 0) break;
            // 检查是否会超过最大等级
            if (tempLevel >= equipment.maxLevel) break;
            
            // 计算当前等级的升级费用
            const tempEquipment = { ...equipment, level: tempLevel };
            upgrade10Cost += calculateUpgradeCost(tempEquipment);
            
            tempLevel++;
            actualLevels++;
        }
        
        canUpgrade10 = state.coin >= upgrade10Cost && actualLevels > 0;
    }
    
    info.innerHTML = `
        <p><strong>装备:</strong> ${equipment.name}</p>
        <p><strong>当前等级:</strong> Lv.${equipment.level}</p>
        <p><strong>当前效果:</strong> 经验+${equipment.effects.expBonus}%${parseFloat(equipment.effects.coinBonus) > 0 ? `<br>铜币+${equipment.effects.coinBonus}%` : ''}</p>
    `;
    
    // 显示单次升级消耗
    cost.innerHTML = `
        <p>单次升级消耗: 铜币: ${upgradeCost}</p>
        ${canUpgrade10 ? `<p>一次性升${actualLevels}级消耗: 铜币: ${upgrade10Cost}</p>` : ''}
    `;
    
    const nextLevel = equipment.level + 1;
    
    // 根据不同情况显示不同的升级结果
    let resultText = '';
    if (canPromote) {
        // 达到可进阶等级
        resultText = `该装备已达到100级，需要先进行进阶！`;
    } else if (equipment.level >= equipment.maxLevel) {
        // 已达到最大等级
        resultText = `该装备已达到最大等级！`;
    } else {
        const nextBonus = (parseFloat(equipment.effects.expBonus) + (equipment.tier + 1) * 0.1).toFixed(2);
        
        // 检查是否达到下一个可进阶的等级
        let levelInfo = '';
        if (nextLevel % 100 === 0) {
            levelInfo = ' (达到100级可进阶!)';
        }
        
        resultText = `升级后: Lv.${nextLevel} (经验+${nextBonus}%)${levelInfo}`;
    }
    
    result.textContent = resultText;
    
    // 设置按钮状态
    confirmBtn.disabled = !canUpgrade;
    confirmBtn.textContent = canUpgrade ? '确认升级' : (canPromote ? '请先进阶' : '无法升级');
    
    if (confirmUpgrade10Btn) {
        confirmUpgrade10Btn.disabled = !canUpgrade10;
        confirmUpgrade10Btn.textContent = canUpgrade10 ? `一次性升${actualLevels}级` : (actualLevels > 0 ? '铜币不足' : '无法升级10级');
    }
    
    modal.style.display = 'flex';
}

// 初始化装备系统
function initEquipmentSystem() {
    // 确保装备数据结构存在
    if (!state.equipment) {
        state.equipment = { equipped: {}, inventory: [] };
    }
    
    if (!state.equipment.equipped) state.equipment.equipped = {};
    if (!state.equipment.inventory) state.equipment.inventory = [];
    
    // 检查是否需要创建初始装备
    if (Object.keys(state.equipment.equipped).length === 0 && state.equipment.inventory.length === 0) {
        createInitialEquipment();
    }
    
    // 更新铜币显示
    const coinCountElement = document.getElementById('coin-count');
    if (coinCountElement) {
        coinCountElement.textContent = state.coin;
    }
    
    // 渲染装备
    renderEquipmentSlots();
    renderEquipmentInventory();
}

// 初始化装备系统事件监听器
function initEquipmentEventListeners() {
    // 背包筛选按钮
    document.querySelectorAll('.inventory-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.inventory-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEquipmentInventory(btn.dataset.filter);
        });
    });
    
    // 装备详情模态框按钮 - 直接获取DOM元素，避免依赖equipmentElements对象
    const equipBtn = document.getElementById('equipment-equip-btn');
    if (equipBtn) {
        equipBtn.addEventListener('click', () => {
            if (selectedEquipment) {
                const action = toggleEquipment(selectedEquipment);
                renderEquipmentSlots();
                renderEquipmentInventory();
                // 更新模态框按钮文本
                equipBtn.textContent = action === 'equipped' ? '卸下' : '装备';
            }
        });
    }
    
    const upgradeBtn = document.getElementById('equipment-upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', () => {
            if (selectedEquipment) {
                showUpgradeModal(selectedEquipment);
            }
        });
    }
    
    const deleteBtn = document.getElementById('equipment-delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (selectedEquipment && confirm('确定要删除这个装备吗？')) {
                deleteEquipment(selectedEquipment);
                renderEquipmentSlots();
                renderEquipmentInventory();
                const detailModal = document.getElementById('equipment-detail-modal');
                if (detailModal) {
                    detailModal.style.display = 'none';
                }
            }
        });
    }
    
    const detailCloseBtn = document.getElementById('equipment-detail-close');
    if (detailCloseBtn) {
        detailCloseBtn.addEventListener('click', () => {
            const detailModal = document.getElementById('equipment-detail-modal');
            if (detailModal) {
                detailModal.style.display = 'none';
            }
        });
    }
    
    // 升级模态框按钮
    const confirmUpgradeBtn = document.getElementById('confirm-upgrade-btn');
    if (confirmUpgradeBtn) {
        confirmUpgradeBtn.addEventListener('click', () => {
            if (selectedEquipment) {
                const success = upgradeEquipmentOnce(selectedEquipment);
                if (success) {
                    // 更新铜币显示
                    const coinCountElement = document.getElementById('coin-count');
                    if (coinCountElement) {
                        coinCountElement.textContent = state.coin;
                    }
                    
                    // 更新装备显示
                    renderEquipmentSlots();
                    renderEquipmentInventory();
                    
                    // 关闭模态框
                    const upgradeModal = document.getElementById('equipment-upgrade-modal');
                    if (upgradeModal) {
                        upgradeModal.style.display = 'none';
                    }
                    
                    // 重新显示装备详情
                    showEquipmentDetail(selectedEquipment);
                }
            }
        });
    }
    
    // 一次性升10级按钮
    const confirmUpgrade10Btn = document.getElementById('confirm-upgrade-10-btn');
    if (confirmUpgrade10Btn) {
        confirmUpgrade10Btn.addEventListener('click', () => {
            if (selectedEquipment) {
                const success = upgradeEquipmentMultiple(selectedEquipment, 10);
                if (success) {
                    // 更新铜币显示
                    const coinCountElement = document.getElementById('coin-count');
                    if (coinCountElement) {
                        coinCountElement.textContent = state.coin;
                    }
                    
                    // 更新装备显示
                    renderEquipmentSlots();
                    renderEquipmentInventory();
                    
                    // 关闭模态框
                    const upgradeModal = document.getElementById('equipment-upgrade-modal');
                    if (upgradeModal) {
                        upgradeModal.style.display = 'none';
                    }
                    
                    // 重新显示装备详情
                    showEquipmentDetail(selectedEquipment);
                }
            }
        });
    }
    
    const cancelUpgradeBtn = document.getElementById('cancel-upgrade-btn');
    if (cancelUpgradeBtn) {
        cancelUpgradeBtn.addEventListener('click', () => {
            const upgradeModal = document.getElementById('equipment-upgrade-modal');
            if (upgradeModal) {
                upgradeModal.style.display = 'none';
            }
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        const detailModal = document.getElementById('equipment-detail-modal');
        const upgradeModal = document.getElementById('equipment-upgrade-modal');
        
        if (detailModal && e.target === detailModal) {
            detailModal.style.display = 'none';
        }
        if (upgradeModal && e.target === upgradeModal) {
            upgradeModal.style.display = 'none';
        }
    });
}

// 修改gainExp函数，加入铜币获取
function originalGainExp(amount, difficulty = 'normal') {
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
            
            console.log(`任务专精加成: +${bonusPercentage.toFixed(2)}% (+${bonusAmount.toFixed(2)}经验)`);
            actualAmount += bonusAmount;
        }
        
        // 应用装备经验加成
        const equipmentBonus = calculateEquipmentExpBonus();
        if (equipmentBonus > 0) {
            const equipmentBonusAmount = actualAmount * (equipmentBonus / 100);
            console.log(`装备加成: +${equipmentBonus.toFixed(2)}% (+${equipmentBonusAmount.toFixed(2)}经验)`);
            actualAmount += equipmentBonusAmount;
        }
    }
    
    console.log(`获得经验: ${amount}${amount > 0 ? ` (实际${actualAmount.toFixed(2)})` : ''}`);
    
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
        
        // 取消任务时扣除铜币
        if (Math.abs(amount) > 0) {
            const coinDeduction = Math.floor(Math.abs(amount) * 10); // 扣除经验值10倍的铜币
            state.coin = Math.max(0, state.coin - coinDeduction);
            console.log(`取消任务扣除铜币: ${coinDeduction}`);
            // 更新铜币显示
            const coinCountElement = document.getElementById('coin-count');
            if (coinCountElement) {
                coinCountElement.textContent = state.coin;
            }
        }
    } else {
        // 正常升级逻辑
        state.currentExp = Number((state.currentExp + actualAmount).toFixed(2));
        state.totalExp = Number((state.totalExp + actualAmount).toFixed(2));
        
        // 获得铜币：经验值的10倍
        if (amount > 0) {
            const coinGain = Math.floor(actualAmount * 10);
            state.coin += coinGain;
            console.log(`获得铜币: ${coinGain}`);
            // 更新铜币显示
            const coinCountElement = document.getElementById('coin-count');
            if (coinCountElement) {
                coinCountElement.textContent = state.coin;
            }
        }
        
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

// 替换原始的gainExp函数
window.gainExp = originalGainExp;

// 修改saveState函数，确保保存装备数据
function enhancedSaveState() {
    // 确保经验值在保存前格式化为两位小数
    const stateToSave = {...state};
    stateToSave.currentExp = Number(state.currentExp.toFixed(2));
    stateToSave.totalExp = Number(state.totalExp.toFixed(2));
    
    localStorage.setItem('cultivationState', JSON.stringify(stateToSave));
    console.log('数据已保存到本地存储 (localStorage) 中的 cultivationState 键');
}

// 修改loadState函数，确保加载装备数据并更新UI
function enhancedLoadState() {
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
        
        // 确保装备系统数据存在
        if (!state.equipment) {
            state.equipment = { equipped: {}, inventory: [] };
        }
        if (!state.equipment.equipped) state.equipment.equipped = {};
        if (!state.equipment.inventory) state.equipment.inventory = [];
        
        // 确保技能系统存在且完整
        if (!state.skills) {
            state.skills = {};
        }
        
        // 修复装备名称 - 确保所有加载的装备使用正确的命名
        for (const slot in state.equipment.equipped) {
            const equipment = state.equipment.equipped[slot];
            if (equipment) {
                equipment.name = getEquipmentName(equipment.type, equipment.tier);
            }
        }
        
        // 修复背包中的装备名称
        state.equipment.inventory.forEach(equipment => {
            equipment.name = getEquipmentName(equipment.type, equipment.tier);
        });
        
        // 更新装备UI
        renderEquipmentSlots();
        renderEquipmentInventory();
        
        // 更新铜币显示
        const coinCountElement = document.getElementById('coin-count');
        if (coinCountElement) {
            coinCountElement.textContent = state.coin;
        }
    }
}

// 替换原始的保存和加载函数
window.saveState = enhancedSaveState;
window.loadState = enhancedLoadState;

// 修改标签页切换函数，支持装备标签页
function enhancedSwitchTab(tabId) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有标签按钮的活跃状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签内容
    const selectedContent = document.getElementById(`${tabId}-content`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // 激活选中的标签按钮
    const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // 初始化装备系统
    if (tabId === 'equipment') {
        initEquipmentSystem();
    }
}

// 替换原始的标签页切换函数
window.switchTab = enhancedSwitchTab;

// 修改初始化事件监听器函数，添加装备系统事件
function enhancedInitEventListeners() {
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
    
    // 初始化装备系统事件监听器
    initEquipmentEventListeners();
}

// 替换原始的事件监听器初始化函数
window.initEventListeners = enhancedInitEventListeners;

// 修改初始化应用函数
function enhancedInitApp() {
    loadState();
    updateCultivationUI();
    updateSkillsUI(); // 初始化技能UI
    initEventListeners();
    switchTab('tasks'); // 默认显示任务标签
}

// 启动应用
enhancedInitApp();