interface WithDate {
  [key: string]: any
}

export const sortArrayByDate = <T extends WithDate>(array: T[], key: keyof T): void => {
  array.sort((a, b) => {
    const dateA = a[key] ? new Date(a[key] as string) : new Date(0)
    const dateB = b[key] ? new Date(b[key] as string) : new Date(0)
    return dateB.getTime() - dateA.getTime()
  })
}
