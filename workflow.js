const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startWorkflow() {
  state = {}
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startWorkflow()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes = [
  {
    id: 1,
    text: 'Select the use case.',
    options: [
      {
        text: 'General',
        setState: { General: true },
        nextText: 2
      },
      {
        text: 'Delete my account',
        setState: { DeleteAcc: true },
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: 'Set Priority to High',
    options: [
      {
        text: 'Continue',
        requiredState: (currentState) => currentState.General,
        nextText: 3
      },
      {
        text: 'Continue',
        requiredState: (currentState) => currentState.DeleteAcc,
        nextText: 19
      }
    ]
  },
  {
    id: 3,
    text: 'Investigate until you are sure you understand the issue.',
    options: [
      {
        text: 'Continue',
        nextText: 4
      }
    ]
  },
  {
    id: 4,
    text: 'Does the ticket need to be escalated to another team?',
    options: [
      {
        text: 'Yes',
        nextText: 5
      },
      {
        text: 'No',
        nextText: 7
      }
    ]
  },
  {
    id: 5,
    text: 'Add appropriate people as followers',
    options: [
      {
        text: 'Continue',
        nextText: 6
      }
    ]
  },
  {
    id: 6,
    text: 'Contact them do determine the next steps.',
    options: [
      {
        text: 'Continue',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    text: 'Do you have all the information necessary to move forward?',
    options: [
      {
        text: 'Yes',
        nextText: 13
      },
      {
        text: 'No',
        nextText: 8
      }
    ]
  },
  {
    id: 8,
    text: 'Is this a first occurrence?',
    options: [
      {
        text: 'Yes',
        nextText: 9
      },
      {
        text: 'No',
        nextText: 11
      }
    ]
  },
  {
    id: 9,
    text: 'Send the client_more_info CR as Pending',
    options: [
      {
        text: 'Continue',
        nextText: 10
      }
    ]
  },
  {
    id: 10,
    text: "Await for client's response",
    options: [
      {
        text: 'Continue',
        nextText: 7
      }
    ]
  },
  {
    id: 11,
    text: 'Send the arrange_meeting CR as Pending.',
    options: [
      {
        text: 'Continue',
        nextText: 12
      }
    ]
  },
  {
    id: 12,
    text: 'Notify involved parties about the meeting once the customer responds.',
    options: [
      {
        text: 'Continue',
        nextText: 13
      }
    ]
  },
  {
    id: 13,
    text: 'Can the issue be immediately resolved?',
    options: [
      {
        text: 'Yes',
        nextText: 16
      },
      {
        text: 'No',
        nextText: 14
      }
    ]
  },
  {
    id: 14,
    text: 'Insert updates if available into worked_on CR and send as Open.',
    options: [
      {
        text: 'Continue',
        nextText: 15
      }
    ]
  },
  {
    id: 15,
    text: 'Contact involved parties to determine how to proceed.',
    options: [
      {
        text: 'Continue',
        nextText: 13
      }
    ]
  },
  {
    id: 16,
    text: 'Draft your response and send it as Resolved.',
    options: [
      {
        text: 'Continue',
        nextText: 17
      }
    ]
  },
  {
    id: 17,
    text: 'Add the resolve_annotation as Private Note.',
    options: [
      {
        text: 'Continue',
        nextText: 18
      }
    ]
  },
 {
   id: 18,
   text: 'If the client reopens, restart the workflow.',
   options: [
     {
       text: 'Restart Workflow',
       nextText: 1
     }
   ]
 },
 {
   id: 19,
   text: 'Is it a free account? (verify)',
   options: [
     {
       text: 'Yes',
       nextText: 23
     },
     {
       text: 'No',
       nextText: 20
     }
   ]
 },
 {
   id: 20,
   text: 'Add Shannon Dew and James Braswell as assignees.',
   options: [
     {
       text: 'Continue',
       nextText: 21
     }
   ]
 },
 {
   id: 21,
   text: 'Send the delete_acc_acknowledgement CR as Pending.',
   options: [
     {
       text: 'Continue',
       nextText: 22
     }
   ]
 },
 {
   id: 22,
   text: 'No further action is required. Resolve without reply once you see the official Private note from Shannon Dew',
   options: [
     {
       text: 'Restart Workflow',
       nextText: 1
     }
   ]
 },
 {
   id: 23,
   text: 'Add James Braswell as assignee.',
   options: [
     {
       text: 'Continue',
       nextText: 24
     }
   ]
 },
 {
   id: 24,
   text: 'Send the delete_acc_acknowledgement CR as Pending.',
   options: [
     {
       text: 'Continue',
       nextText: 25
     }
   ]
 },
 {
   id: 25,
   text: 'Did the customer reply within 3 workdays?',
   options: [
     {
       text: 'No',
       nextText: 26
     },
     {
       text: 'Yes',
       nextText: 27
     }
   ]
 },
 {
   id: 26,
   text: 'Verify that the user account is deleted. Send the delete_acc_closure CR as Resolved.',
   options: [
     {
       text: 'Continue',
       nextText: 18
     }
   ]
 },
 {
   id: 27,
   text: 'Is there a specific issue that could be addressed for the customer to change their mind?',
   options: [
     {
       text: 'No',
       nextText: 26
     },
     {
       text: 'Yes',
       nextText: 28
     }
   ]
 },
 {
   id: 28,
   text: 'Check with others that might help you solve this issue. Once the solution is provided, send a reply as Resolved.',
   options: [
     {
       text: 'Continue',
       nextText: 18
     }
   ]
 }
]

startWorkflow()