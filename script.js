// 도타2 특화 분석 함수들
function calculateGuildStats() {
    const totalMMR = dota2GuildMembers.reduce((sum, member) => sum + member.mmr, 0);
    const avgMMR = Math.round(totalMMR / dota2GuildMembers.length);
    
    const winRates = dota2GuildMembers.map(m => parseFloat(m.winRate));
    const avgWinRate = (winRates.reduce((a, b) => a + b) / winRates.length).toFixed(1);
    
    document.getElementById('avg-mmr').textContent = avgMMR.toLocaleString();
    document.getElementById('guild-winrate').textContent = avgWinRate + '%';
    document.getElementById('activity-rate').textContent = '90%'; // 예시
}

function displayMembers() {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    dota2GuildMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        memberCard.innerHTML = `
            <div class="member-header">
                <div class="member-name">${member.name}</div>
                <div class="member-mmr">${member.mmr} MMR</div>
            </div>
            <div class="member-roles">
                <span class="role-badge">${member.mainRole}</span>
                <span class="role-badge">${member.subRole}</span>
            </div>
            <div class="member-stats">
                <div>승률: <strong>${member.winRate}</strong></div>
                <div>KDA: <strong>${member.kda}</strong></div>
                <div>GPM/XPM: <strong>${member.gpm}/${member.xpm}</strong></div>
                <div>파티 참여: <strong>${member.partyAttendance}</strong></div>
            </div>
            <div class="hero-list">
                주력 히어로: ${member.favoriteHeroes.slice(0, 3).join(', ')}
            </div>
        `;
        
        container.appendChild(memberCard);
    });
}

// 역할 분포 차트
function createRoleChart() {
    const roleCount = {};
    dota2GuildMembers.forEach(member => {
        roleCount[member.mainRole] = (roleCount[member.mainRole] || 0) + 1;
    });

    const ctx = document.getElementById('role-distribution').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(roleCount),
            datasets: [{
                data: Object.values(roleCount),
                backgroundColor: ['#ff9900', '#4fc3f7', '#4caf50', '#f44336', '#9c27b0']
            }]
        }
    });
}

// MMR 분포 차트
function createMMRChart() {
    const mmrValues = dota2GuildMembers.map(m => m.mmr);
    
    const ctx = document.getElementById('mmr-distribution').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dota2GuildMembers.map(m => m.name),
            datasets: [{
                label: 'MMR',
                data: mmrValues,
                backgroundColor: '#ff9900'
            }]
        }
    });
}

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', function() {
    calculateGuildStats();
    displayMembers();
    createRoleChart();
    createMMRChart();
});
// 역할별 통계 계산
function calculateRoleStats() {
    const roleStats = {};
    
    dota2GuildMembers.forEach(member => {
        const role = member.mainRole;
        if (!roleStats[role]) {
            roleStats[role] = {
                count: 0,
                totalMMR: 0,
                totalWinRate: 0,
                members: []
            };
        }
        
        roleStats[role].count++;
        roleStats[role].totalMMR += member.mmr;
        roleStats[role].totalWinRate += parseFloat(member.winRate);
        roleStats[role].members.push(member.name);
    });
    
    return roleStats;
}

// MMR 순위 표시
function displayMMRRanking() {
    const sortedMembers = [...dota2GuildMembers].sort((a, b) => b.mmr - a.mmr);
    
    const rankingContainer = document.createElement('div');
    rankingContainer.className = 'ranking-container';
    rankingContainer.innerHTML = '<h3>🏆 MMR 순위</h3>';
    
    sortedMembers.forEach((member, index) => {
        const rankCard = document.createElement('div');
        rankCard.className = 'rank-card';
        rankCard.innerHTML = `
            <span class="rank">${index + 1}위</span>
            <span class="rank-name">${member.name}</span>
            <span class="rank-mmr">${member.mmr} MMR</span>
            <span class="rank-winrate">${member.winRate}</span>
        `;
        rankingContainer.appendChild(rankCard);
    });
    
    document.querySelector('.dashboard').appendChild(rankingContainer);
}

// 역할 배치 최적화 제안
function suggestOptimalTeams() {
    const roleStats = calculateRoleStats();
    
    console.log("📊 역할별 현황:");
    Object.keys(roleStats).forEach(role => {
        const avgMMR = Math.round(roleStats[role].totalMMR / roleStats[role].count);
        const avgWinRate = (roleStats[role].totalWinRate / roleStats[role].count).toFixed(1);
        console.log(`${role}: ${roleStats[role].count}명, 평균 MMR: ${avgMMR}, 승률: ${avgWinRate}%`);
    });
}

// 육각형 스탯 차트 생성 함수
function createRadarChart(memberName, stats, containerId) {
    const ctx = document.getElementById(containerId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['라인전', '한타능력', '오브젝트', '생존력', '팜능력', '리더십'],
            datasets: [{
                label: memberName,
                data: [
                    stats.laning,
                    stats.teamfight, 
                    stats.objective,
                    stats.survival,
                    stats.farming,
                    stats.leadership
                ],
                backgroundColor: 'rgba(255, 153, 0, 0.2)',
                borderColor: '#ff9900',
                pointBackgroundColor: '#ff9900',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#ff9900'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#e0e0e0',
                        font: {
                            size: 11
                        }
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: '#b0b0b0',
                        stepSize: 2
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

// 멤버 카드에 육각형 스탯 추가
function displayMembersWithStats() {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    dota2GuildMembers.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        // 고유한 차트 ID 생성
        const chartId = `radar-chart-${index}`;
        
        memberCard.innerHTML = `
            <div class="member-header">
                <div class="member-name">${member.name}</div>
                <div class="member-mmr">${member.mmr} MMR</div>
            </div>
            <div class="member-roles">
                <span class="role-badge">${member.mainRole}</span>
                <span class="role-badge">${member.subRole}</span>
            </div>
            
            <!-- 육각형 스탯 차트 -->
            <div class="radar-container">
                <canvas id="${chartId}" width="200" height="200"></canvas>
            </div>
            
            <div class="member-stats">
                <div>승률: <strong>${member.winRate}</strong></div>
                <div>KDA: <strong>${member.kda}</strong></div>
                <div>GPM/XPM: <strong>${member.gpm}/${member.xpm}</strong></div>
                <div>파티 참여: <strong>${member.partyAttendance}</strong></div>
            </div>
            
            <div class="member-style">
                <div class="strength">💪 강점: ${member.strength}</div>
                <div class="weakness">⚠️ 약점: ${member.weakness}</div>
            </div>
            
            <div class="hero-list">
                주력 히어로: ${member.favoriteHeroes.slice(0, 3).join(', ')}
            </div>
        `;
        
        container.appendChild(memberCard);
        
        // 차트 생성 (DOM이 생성된 후)
        setTimeout(() => {
            if (member.stats) {
                createRadarChart(member.name, member.stats, chartId);
            }
        }, 100);
    });
}

// 페이지 로드시 실행 - 업데이트된 함수 사용
document.addEventListener('DOMContentLoaded', function() {
    calculateGuildStats();
    displayMembersWithStats(); // 기존 displayMembers() 대신 사용
    createRoleChart();
    createMMRChart();
    suggestOptimalTeams();
});

// 스탯 설명 툴팁 추가 함수
function addStatExplanation() {
    const explanationHTML = `
        <div class="stat-explanation">
            <h4>스탯 설명</h4>
            <ul class="stat-list">
                <li><strong>라인전:</strong> 초반 라인전 능력</li>
                <li><strong>한타능력:</strong> 팀파이트 기여도</li>
                <li><strong>오브젝트:</strong> 목표물 집중력</li>
                <li><strong>생존력:</strong> 위기 회피 능력</li>
                <li><strong>팜능력:</strong> 골드/경험치 수급</li>
                <li><strong>리더십:</strong> 팀 운영 및 의사소통</li>
            </ul>
        </div>
    `;
    
    // 각 멤버 카드에 스탯 설명 추가
    document.querySelectorAll('.member-card').forEach(card => {
        card.insertAdjacentHTML('beforeend', explanationHTML);
    });
}

// 히어로 이미지 표시 함수
function createHeroImages(heroes) {
    return heroes.slice(0, 3).map(hero => {
        const imageUrl = getHeroImageUrl(hero);
        return `
            <div class="hero-image-container">
                <img src="${imageUrl}" alt="${hero}" title="${hero}" class="hero-image">
                <div class="hero-tooltip">${hero}</div>
            </div>
        `;
    }).join('');
}

// 업데이트된 멤버 카드 생성 함수
function displayMembersWithStats() {
    const container = document.getElementById('members-container');
    container.innerHTML = '';

    dota2GuildMembers.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        const chartId = `radar-chart-${index}`;
        const heroImagesHTML = createHeroImages(member.favoriteHeroes);
        
        memberCard.innerHTML = `
            <div class="member-header">
                <div class="member-name">${member.name}</div>
                <div class="member-mmr">${member.mmr} MMR</div>
            </div>
            <div class="member-roles">
                <span class="role-badge">${member.mainRole}</span>
                <span class="role-badge">${member.subRole}</span>
            </div>
            
            <!-- 육각형 스탯 차트 -->
            <div class="radar-container">
                <canvas id="${chartId}" width="200" height="200"></canvas>
            </div>
            
            <div class="member-stats">
                <div>승률: <strong>${member.winRate}</strong></div>
                <div>KDA: <strong>${member.kda}</strong></div>
                <div>GPM/XPM: <strong>${member.gpm}/${member.xpm}</strong></div>
                <div>파티 참여: <strong>${member.partyAttendance}</strong></div>
            </div>
            
            <!-- 히어로 이미지 영역 -->
            <div class="hero-images-section">
                <div class="section-title">주력 히어로</div>
                <div class="hero-images-container">
                    ${heroImagesHTML}
                </div>
            </div>
            
            <div class="member-style">
                <div class="strength">💪 강점: ${member.strength}</div>
                <div class="weakness">⚠️ 약점: ${member.weakness}</div>
            </div>
        `;
        
        container.appendChild(memberCard);
        
        // 차트 생성
        setTimeout(() => {
            if (member.stats) {
                createRadarChart(member.name, member.stats, chartId);
            }
        }, 100);
    });
}

// 이미지 로딩 처리 함수
function preloadHeroImages() {
    const allHeroes = [...new Set(dota2GuildMembers.flatMap(member => member.favoriteHeroes))];
    
    allHeroes.forEach(heroName => {
        const img = new Image();
        img.src = getHeroImageUrl(heroName);
    });
}

// 이미지 에러 처리
function handleImageError(img) {
    img.style.display = 'none';
    const container = img.parentElement;
    const heroName = img.alt;
    container.innerHTML = `<div class="hero-name-fallback">${heroName}</div>`;
}

// 업데이트된 히어로 이미지 생성 함수
function createHeroImages(heroes) {
    return heroes.slice(0, 3).map(hero => {
        const imageUrl = getHeroImageUrl(hero);
        return `
            <div class="hero-image-container">
                <img src="${imageUrl}" 
                     alt="${hero}" 
                     title="${hero}" 
                     class="hero-image"
                     onerror="handleImageError(this)"
                     loading="lazy">
                <div class="hero-tooltip">${hero}</div>
            </div>
        `;
    }).join('');
}

