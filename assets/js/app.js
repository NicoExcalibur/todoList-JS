let app = {
    init: function(){
        app.listenTasksEvents();
        app.formEvents();
    },

    // Méthode venant appliquer les écouteurs d'événements à notre formulaire
    formEvents: function(){
        // On cible notre formulaire
        let form = document.querySelector('.task--add form');

        // J'écoute les événements submit sur mon formulaire
        form.addEventListener('submit', app.handleAddTaskFormSubmit);                
    },

    handleAddTaskFormSubmit: function(event) {
        // On empêche le comportement par défaut du navigateur (ici recharger la page)
        event.preventDefault()
        // Récupération des valeurs du formulaire
        let taskNameValue = document.querySelector('.task--add input').value;

        // Récupération du template de tâche
        let template = document.querySelector('#task-template');
        // On crée une nouvelle tâche en clonant le template
        let newTask = template.content.cloneNode(true);

        // On remplit les différents éléments de notre copie
        newTask.querySelector('.task__name-display').textContent = taskNameValue;
        newTask.querySelector('.task__name-edit').setAttribute('value', taskNameValue);

        // On appelle bindTaskEvents sur la tâche fraichement crée pour lui appliquer les différents écouteurs d'événéments.
        // Cette dernière étant créée après le chargement de la page, la boucle qui appliquait les écouteurs est déjà passée. Notre nouvelle tâche n'aura donc aucun écouteur par défaut
        app.bindTaskEvents(newTask);

        // On ajoute l'élément créé à la suite des autres éléments
        document.querySelector('.tasks').appendChild(newTask);

    },

    // Méthode permettant d'écouter les événements sur toutes les tâches
    listenTasksEvents: function() {
        // On sélectionne toutes les tâches éditables
        let tasks = document.querySelectorAll('.task--editable');

        // On boucle sur sur la liste des tâches pour venir écouteur les événements sur chacune d'entre elles.
        for (let i = 0; i < tasks.length; i++) {
            // Récupération de la tâche courante de la boucle
            let currentTask = tasks[i];
            // On appelle la méthode bindTaskEvents qui va appliquer les différents écouteur d'événements sur la tâche.
            app.bindTaskEvents(currentTask);
        }
    },

    // Méthode permettant d'appliquer des écouteurs d'événements sur une tâche passée en arguments. 
    bindTaskEvents: function(task) {
        // On cible le titre de la tâche
        let taskTitle = task.querySelector('.task__name p');

        // On cible aussi le bouton jaune 
        let taskEditButton = task.querySelector('.task__button--modify');

        // On pose l'écouteur d'événement clic sur le titre et sur le bouton
        taskTitle.addEventListener('click', app.handleClickOnTaskTitle);
        taskEditButton.addEventListener('click', app.handleClickOnTaskTitle);

        // On récupère l'input de la tâche
        let taskInput = task.querySelector('.task__name > input');

        // On pose l'écouteur d'événement blur et sur la touche entrée sur l'input
        taskInput.addEventListener('blur', app.handleTaskTitle);
        taskInput.addEventListener('keydown', app.handleTaskTitleEnterKey);

        // On cible le bouton de validation 
        let taskButtonValidate = task.querySelector('.task__button--validate');
        let taskButtonIncomplete = task.querySelector('.task__button--incomplete');

        // On pose un écouteur de clic sur le bouton "terminer la tâche"
        taskButtonValidate.addEventListener('click', app.handleCompleteButtonClick);
        taskButtonIncomplete.addEventListener('click', app.handleCompleteButtonClick);
    },

    // Méthode permettant de cocher/décocher une tâche
    handleCompleteButtonClick: function(event) {
        // On sélectionne l'élément sur lequel on a cliqué
        let clickedElement = event.currentTarget;

        // Récupération de la tâche parente
        let taskElement = clickedElement.closest('.task');

        // La méthode toggle permet d'ajouter une classe si elle n'est pas présente et de la retirer si elle est présente.
        taskElement.classList.toggle('task--complete');
    },

    handleClickOnTaskTitle: function(event){
        // On sélectionne l'élément sur lequel on cliqué
        let clickedElement = event.currentTarget;

        // Grâce à la fonction closest, on peut récupérer la tâche parente de cet élément
        let taskElement = clickedElement.closest('.task');

        taskElement.classList.add('task--edit');

    },
    handleTaskTitle: function(event) {
        // Récupération de l'input qui a déclenché l'événement
        let inputElement = event.currentTarget

        // Récupération du titre de la tâche grâce à previousElementSibling
        let title = inputElement.previousElementSibling;

        // Mise à jour du titre avec la nouvelle valeur de l'input
        title.textContent = inputElement.value;

        // On récupère le parent
        let taskElement = inputElement.closest('.task');
        taskElement.classList.remove('task--edit');

    },
    handleTaskTitleEnterKey: function(event) {
        if(event.code == "Enter") {
            app.handleTaskTitle(event);
        }

    }

};

document.addEventListener('DOMContentLoaded', app.init);