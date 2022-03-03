const projects = document.getElementsByClassName('project');
const portalContent = document.querySelector('.portal__content');


function getProjectDetails(project, projectData) {

    if (projectData.upstreamProjectName) {
        const baseLineProject = document.createElement('span');
        baseLineProject.classList.add("baselineReference");
        baseLineProject.innerHTML = "Child project of " + projectData.upstreamProjectName;
        project.querySelector('.project-name').append(baseLineProject);
    }


    const projectDetails = project.querySelector('.projectDetails');
    const environments = projectDetails.querySelector('.environments');
    const totalProjects = portalContent.querySelector('.totalValue');
    totalProjects.innerHTML = parseFloat(totalProjects.innerHTML) + 1;
    switch (projectData.plan) {
        case "Single":
            const starterProjects = portalContent.querySelector('.starterValue');
            starterProjects.innerHTML = parseFloat(starterProjects.innerHTML) + 1;
            break;
        case "Standard":
            const standardProjects = portalContent.querySelector('.standardValue');
            standardProjects.innerHTML = parseFloat(standardProjects.innerHTML) + 1;
            break;
        case "Studio":
            const professionalProjects = portalContent.querySelector('.proValue');
            professionalProjects.innerHTML = parseFloat(professionalProjects.innerHTML) + 1;
            break;
    }


    fetch("https://www.s1.umbraco.io/api/project/getfileversions", {
        "headers": {
            "x-project-id": projectData.projectId,
        }
    }).then(response => response.json()
    ).then(function (environmentVersions) {

        for (let i = 0; i < projectData.environments.length; i++) {
            let currentEnvironment = projectData.environments[i];
            const environment = document.createElement('div');
            const currentEnvironmentVersions = environmentVersions.find(x => x.repositoryName === currentEnvironment.websiteId).files;


            environment.classList.add('environment');
            switch (currentEnvironment.status) {
                case "Idle":
                    environment.classList.add('success');
                    break;
                case "Deploying":
                    environment.classList.add('warning');
                    break;
                case "Erroring":
                    environment.classList.add('error');
                    break;
            }
            const environmentStatusWrapper = document.createElement('div');
            environmentStatusWrapper.classList.add('environmentStatusWrapper');

            const environmentStatus = document.createElement('span');
            environmentStatus.classList.add('environment-status');

            const environmentName = document.createElement('strong');
            environmentName.innerHTML = currentEnvironment.name;

            const environmentVersion = document.createElement('div');
            environmentVersion.classList.add('environmentVersions');

            for (let v = 0; v < currentEnvironmentVersions.length; v++) {
                currentVersion = currentEnvironmentVersions[v];
                if (currentVersion.versionWwwRoot != "") {
                    const versionInfo = document.createElement('span');
                    versionInfo.classList.add('versionInfo');
                    versionInfo.innerHTML = currentVersion.fileName + " " + currentVersion.versionWwwRoot;
                    environmentVersion.append(versionInfo)
                }
            }

            environmentStatusWrapper.append(environmentStatus);
            environmentStatusWrapper.append(environmentName);
            environment.append(environmentStatusWrapper);
            environmentStatusWrapper
            environment.append(environmentVersion);

            environments.prepend(environment);
        }
    });
}

function getProjectUsage(project, projectData) {

    const usage = document.createElement('div');
    usage.classList.add('usageWrapper');

	fetch("https://www.s1.umbraco.io/api/ucp/usage/usage", {
        "headers": {
            "x-project-id": projectData.projectId,
        }
    }).then(response => response.json()
    ).then(function (data) {
    	const usageData = data.Usage;
    	const bandwidthStat = usageData.filter(obj => {  return obj.Name == "Bandwidth"})[0];
    	const mediaStorageStat = usageData.filter(obj => {  return obj.Name == "Media Storage"})[0];
    	const customDomainsStat = usageData.filter(obj => {  return obj.Name == "Custom Domains"})[0];
    	const contentStat = usageData.filter(obj => {  return obj.Name == "Content Nodes"})[0];
    	const hostnames = (customDomainsStat.Value / Number(customDomainsStat.Limit)) * 100;
        const contentNodes = (contentStat.Value / Number(contentStat.Limit)) * 100;
        const mediaSize = (mediaStorageStat.Value / Number(mediaStorageStat.Limit)) * 100;
        const bandwidth = (bandwidthStat.Value / Number(bandwidthStat.Limit)) * 100;
        const hostnameUsage = `<div class="usage"><span>Custom Domains</span>
			<div class="progressBar">
				<span class="progressBarFill 
				${ hostnames > 90 && hostnames < 100 ? "warning" : ""}
				${ hostnames >= 100 ? "danger" : ""}" 
				style="width: ${hostnames}%;"></span>
			</div></div>`
        const contentNodesUsage = `<div class="usage"><span>Content nodes</span>
			<div class="progressBar">
				<span class="progressBarFill 
				${ contentNodes > 90 && hostnames < 100 ? "warning" : ""}
				${ contentNodes >= 100 ? "danger" : ""}"
				style="width: ${contentNodes}%;"></span>
			</div></div>`
        const mediaSizeUsage = `<div class="usage"><span>Media storage</span>
			<div class="progressBar">
				<span class="progressBarFill 
				${ mediaSize > 90 && hostnames < 100 ? "warning" : ""}
				${ mediaSize >= 100 ? "danger" : ""}"
				style="width: ${mediaSize}%;"></span>
			</div></div>`
        const bandwidthUsage = `<div class="usage"><span>Bandwidth</span>
			<div class="progressBar">
				<span class="progressBarFill 
				${ bandwidth > 90 && hostnames < 100 ? "warning" : ""}
				${ bandwidth >= 100 ? "danger" : ""}"
				style="width: ${bandwidth}%;"></span>
			</div></div>`
        usage.insertAdjacentHTML('beforeend', hostnameUsage);
        usage.insertAdjacentHTML('beforeend', contentNodesUsage);
        usage.insertAdjacentHTML('beforeend', mediaSizeUsage);
        usage.insertAdjacentHTML('beforeend', bandwidthUsage);
        project.querySelector('.project-inner').append(usage);

    });

}

function prepareProject(currentProject) {
    const projectInner = currentProject.querySelector('.project-inner');
    const projectDetails = document.createElement('div');
    projectDetails.classList.add('projectDetails');

    const environments = document.createElement('div');
    environments.classList.add('environments');

    projectDetails.append(environments);
    projectInner.append(projectDetails);
}

function prepareProjectSummary() {
    const summary = document.createElement('div');
    summary.classList.add('projectSummary');
    summary.classList.add('container');

    const projectInfo = document.createElement('div');
    projectInfo.classList.add('projectInfo');
    const projectInfoInner = document.createElement('p');
    projectInfoInner.classList.add('projectInfoInner');
    projectInfoInner.innerHTML = `<strong>Total:&nbsp;<span class="totalValue">0</span></strong><strong>Starter:&nbsp;<span class="starterValue">0</span></strong><strong>Standard:&nbsp;<span class="standardValue">0</span></strong><strong>Professional:&nbsp;<span class="proValue">0</span></strong>`;

    projectInfo.append(projectInfoInner);
    summary.append(projectInfo);
    const projects = portalContent.querySelector('.projects');
    portalContent.insertBefore(summary, projects);
}

function extendProjects() {
    for (let i = 0; i < projects.length; i++) {
        let currentProject = projects[i];
        let currentProjectId = currentProject.querySelector('.favorite').dataset.project;

        prepareProject(currentProject);
        fetch("https://www.s1.umbraco.io/api/project/getproject", {
            "headers": {
                "x-project-id": currentProjectId
            }
        }).then(response => response.json()
        ).then(data => {
            let projectDetails = getProjectDetails(currentProject, data);
            let projectUsage = getProjectUsage(currentProject, data);
        });
    }
}

window.onload = function () {
    prepareProjectSummary();
    extendProjects();
}
