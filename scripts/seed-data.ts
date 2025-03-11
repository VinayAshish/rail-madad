enum PriorityLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
  }
  
  const categories = [
    {
      name: "Health Issue or Accident",
      description: "Medical emergencies, injuries, or health-related issues during journey",
      priority: PriorityLevel.CRITICAL,
      color: "#EF4444", // Red
      isActive: true,
    },
    {
      name: "Theft or Robbery",
      description: "Incidents of theft, robbery, or loss of belongings during journey",
      priority: PriorityLevel.HIGH,
      color: "#F97316", // Orange
      isActive: true,
    },
    {
      name: "Ticketing and Reservations",
      description: "Issues related to ticket booking, confirmation, or cancellation",
      priority: PriorityLevel.HIGH,
      color: "#F97316", // Orange
      isActive: true,
    },
    {
      name: "Seat Reserved by Other Person",
      description: "Complaints about seat being occupied by unauthorized passengers",
      priority: PriorityLevel.MEDIUM,
      color: "#EAB308", // Yellow
      isActive: true,
    },
    {
      name: "AC or Fan Issue",
      description: "Problems with air conditioning, fans, or temperature control in the coach",
      priority: PriorityLevel.MEDIUM,
      color: "#EAB308", // Yellow
      isActive: true,
    },
    {
      name: "Cleanliness",
      description: "Issues related to cleanliness of coaches, toilets, or stations",
      priority: PriorityLevel.MEDIUM,
      color: "#EAB308", // Yellow
      isActive: true,
    },
    {
      name: "Food Quality",
      description: "Complaints about food quality, hygiene, or service",
      priority: PriorityLevel.MEDIUM,
      color: "#EAB308", // Yellow
      isActive: true,
    },
    {
      name: "Staff Behavior",
      description: "Issues related to behavior of railway staff or service providers",
      priority: PriorityLevel.MEDIUM,
      color: "#EAB308", // Yellow
      isActive: true,
    },
  ]
  
  