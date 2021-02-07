const projects = document.getElementsByClassName('project');
const portalContent = document.querySelector('.portal__content');


function getProjectDetails(project, projectData){
	
		console.log(projectData);
		
		if(projectData.upstreamProjectName){
			const baseLineProject = document.createElement('span');
			baseLineProject.classList.add("baselineReference");
			baseLineProject.innerHTML = "Child project of " + projectData.upstreamProjectName;
			project.querySelector('.project-name').append(baseLineProject);
		}
		
		
		const projectDetails = project.querySelector('.projectDetails');
		const environments = projectDetails.querySelector('.environments');
		const totalProjects = portalContent.querySelector('.totalValue');
		totalProjects.innerHTML =  parseFloat(totalProjects.innerHTML) + 1;
		switch(projectData.plan){
			case "Single":
				const starterProjects = portalContent.querySelector('.starterValue');
				starterProjects.innerHTML =  parseFloat(starterProjects.innerHTML) + 1;
			break;
			case "Standard":
				const standardProjects = portalContent.querySelector('.standardValue');
				standardProjects.innerHTML =  parseFloat(standardProjects.innerHTML) + 1;
			break;
			case "Studio":
				const proffessionalProjects = portalContent.querySelector('.proValue');
				proffessionalProjects.innerHTML =  parseFloat(proffessionalProjects.innerHTML) + 1;
				break;
			}
	
	
		fetch("https://www.s1.umbraco.io/api/project/getfileversions", {
		  "headers": {
		     "x-project-id": projectData.projectId,
		  }}).then(response => response.json()
		).then(function(environmentVersions){
		
			for(let i=0; i < projectData.environments.length; i++){
				let currentEnvironment = projectData.environments[i];
				const environment = document.createElement('div');
				const currentEnvironmentVersions = environmentVersions.find(x => x.repositoryName === currentEnvironment.websiteId).files;

				
				environment.classList.add('environment');
				switch(currentEnvironment.status){
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
				
				for(let v=0; v<currentEnvironmentVersions.length;v++){
					currentVersion = currentEnvironmentVersions[v];
					if(currentVersion.versionWwwRoot != ""){
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
	
	const usage = document.createElement('div');
	usage.classList.add('usageWrapper');
	
	Promise.all([
		fetch("https://www.s1.umbraco.io/api/usage/GetUsagePlanLimitations", {
			"headers": {
			   "x-project-id": projectData.projectId,
			}}),
		fetch("https://www.s1.umbraco.io/api/usage/GetUsageCustomHostnames", {
			"headers": {
			   "x-project-id": projectData.projectId,
			}}),
		fetch("https://www.s1.umbraco.io/api/usage/GetUsageContentNodes", {
			  "headers": {
			     "x-project-id": projectData.projectId,
			}}),
		fetch("https://www.s1.umbraco.io/api/usage/GetUsageMediaSize", {
				"headers": {
				   "x-project-id": projectData.projectId,
			}}),
		fetch("https://www.s1.umbraco.io/api/usage/GetUsageBandwidth", {
				"headers": {
				   "x-project-id": projectData.projectId,
			}})
		]).then(function (responses) {
			return Promise.all(responses.map(function (response) {
			return response.json();
			}));
		}).then(function (data) {
			const limits = data[0];
			const hostnames = data[1];
			const contentNodes = data[2];
			const mediaSize = data[3];
			const bandwidth = data[4];
			console.log(data)
			const hostnameUsage = `<div class="usage"><span>Custom Domains</span>
			<div class="progressBar">
				<span class="progressBarFill ${((hostnames / limits.AllowedCustomHostnames) *100) > 90 ? "danger" : ""}" style="width: ${(hostnames / limits.AllowedCustomHostnames) *100}%;"></span>
			</div></div>`
				const contentNodesUsage = `<div class="usage"><span>Content nodes</span>
			<div class="progressBar">
				<span class="progressBarFill ${((contentNodes / limits.AllowedContentNodes) *100) > 90 ? "danger" : ""}" style="width: ${(contentNodes / limits.AllowedContentNodes) *100}%;"></span>
			</div></div>`
				const mediaSizeUsage = `<div class="usage"><span>Media storage</span>
			<div class="progressBar">
				<span class="progressBarFill ${((mediaSize / limits.AllowedMedia) *100) > 90 ? "danger" : ""}" style="width: ${(mediaSize / limits.AllowedMedia) *100}%;"></span>
			</div></div>`
				const bandwidthUsage = `<div class="usage"><span>Bandwidth</span>
			<div class="progressBar">
				<span class="progressBarFill ${((bandwidth / limits.AllowedBandwidth) *100) > 90 ? "danger" : ""}" style="width: ${(bandwidth / limits.AllowedBandwidth) *100}%;"></span>
			</div></div>`
			usage.insertAdjacentHTML('beforeend',hostnameUsage);
			usage.insertAdjacentHTML('beforeend',contentNodesUsage);
			usage.insertAdjacentHTML('beforeend',mediaSizeUsage);
			usage.insertAdjacentHTML('beforeend',bandwidthUsage);
			project.querySelector('.project-inner').append(usage);

		});

}

function prepareProject(currentProject){
		const projectInner = currentProject.querySelector('.project-inner');
		const projectDetails = document.createElement('div');
		projectDetails.classList.add('projectDetails');
			
		const environments = document.createElement('div');
		environments.classList.add('environments');
		
		projectDetails.append(environments);
		projectInner.append(projectDetails);
}

function prepareProjectSummary(){
	const summary = document.createElement('div');
	summary.classList.add('projectSummary');
	summary.classList.add('container');
	
	const projectInfo = document.createElement('div');
	projectInfo.classList.add('projectInfo');
	const projectInfoInner = document.createElement('p');
	projectInfoInner.classList.add('projectInfoInner');
	projectInfoInner.innerHTML = `<strong>Total:&nbsp;<span class="totalValue">0</span></strong><strong>Starter:&nbsp;<span class="starterValue">0</span></strong><strong>Standard:&nbsp;<span class="standardValue">0</span></strong><strong>Proffessional:&nbsp;<span class="proValue">0</span></strong>`;
	
	projectInfo.append(projectInfoInner);
	summary.append(projectInfo);
	const projects = portalContent.querySelector('.projects');
    portalContent.insertBefore(summary, projects);
}

function extendProjects(){
	for (let i = 0; i < projects.length; i++) {
	let currentProject = projects[i];
	let currentProjectId =  currentProject.querySelector('.favorite').dataset.project;
	
	prepareProject(currentProject);
		fetch("https://www.s1.umbraco.io/api/project/getproject", {
		  "headers": {
		  "x-project-id": currentProjectId
		  }
		}).then(response => response.json()
		).then(data => {
			let projectDetails = getProjectDetails(currentProject, data)
		});
	}
}

window.onload = function(){
	
prepareProjectSummary();	
extendProjects();	

}
