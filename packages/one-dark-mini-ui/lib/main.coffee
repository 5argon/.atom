root = document.documentElement

module.exports =
  activate: (state) ->
    atom.config.observe 'one-dark-mini-ui.fontSize', (value) ->
      setFontSize(value)

    atom.config.observe 'one-dark-mini-ui.tabSizing', (value) ->
      setTabSizing(value)

  deactivate: ->
    unsetFontSize()
    unsetTabSizing()

# Font Size -----------------------
setFontSize = (currentFontSize) ->
  if Number.isInteger(currentFontSize)
    root.style.fontSize = "#{currentFontSize}px"
  else if currentFontSize is 'Auto'
    unsetFontSize()

unsetFontSize = ->
  root.style.fontSize = ''

# Tab Sizing -----------------------
setTabSizing = (tabSizing) ->
  root.setAttribute('theme-one-dark-mini-ui-tabsizing', tabSizing.toLowerCase())

unsetTabSizing = ->
  root.removeAttribute('theme-one-dark-mini-ui-tabsizing')
