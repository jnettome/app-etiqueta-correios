import { isValidCPF, formatCPF, formatCNPJ, formatCEP } from '@brazilian-utils/brazilian-utils'

const urlParams = new URLSearchParams(window.location.search)
let orders

if (urlParams) {
  orders = urlParams.getAll('pedido').concat(urlParams.getAll('pedido[]'))
  const minItemRows = parseInt(urlParams.get('page'), 10)

  if (orders.length) {
    const formatNumber = price => price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    const formatDoc = doc => isValidCPF(doc) ? formatCPF(doc) : formatCNPJ(doc)

    const $main = document.getElementsByTagName('main')[0]

    orders.forEach((orderJson, i) => {
      let order
      try {
        order = JSON.parse(orderJson)
      } catch (err) {
        console.error(err)
        window.alert(`O ${(i + 1)}° pedido é inválido`)
        return
      }

      if (!Array.isArray(order.itens)) {
        order.itens = []
      }
      if (!order.itens.length || minItemRows) {
        for (let i = 1; i <= (minItemRows || 20); i++) {
          if (order.itens.length < i) {
            order.itens.push({})
          } else {
            break
          }
        }
      }

      let quantity = 0
      let subtotal = 0
      order.itens.forEach(item => {
        if (item && item.quant) {
          quantity += item.quant
          if (item.valor) {
            subtotal += (item.valor * item.quant)
          }
        }
      })

      const getCelText = (prop, obj = order) => obj[prop] || '&nbsp;'

      $main.insertAdjacentHTML('beforeend', `

        <div class="declaracao">

          <div class="row">
            <div class="col-7">
              <div class="bloco" style="font-weight: normal; font-size: 18px; display: flex; justify-content: center; align-items: center; height: 340px; border-width: 1px;">
                USO EXCLUSIVO DOS CORREIOS
                <br>
                Cole aqui a etiqueta com o código identificador da encomenda
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-7">
              <div class="bloco" style="border: 0; font-weight: normal; margin: 10px 0;">
                <div class="row">
                  <div class="col-2" style="text-align: left;">
                    Recebedor:
                  </div>
                  <div class="col-10">
                    <div class="assinatura"></div>
                  </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                  <div class="col-2" style="text-align: left;">
                    Assinatura:
                  </div>
                  <div class="col-4">
                    <div class="assinatura"></div>
                  </div>
                  <div class="col-2" style="text-align: left;">
                    Documento:
                  </div>
                  <div class="col-4">
                    <div class="assinatura"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row linha">
            <div class="col-7">
              <div style="border: 2px solid #000; height: 60px;">
                <strong style="background-color: #000; color: white; display: inline-block; padding: 2px 20px;">
                  ENTREGA NO VIZINHO AUTORIZADA?
                </strong>
                <br>
                Entrega no vizinho não autorizada
              </div>
            </div>
          </div>

          <div class="row linha">
            <div class="col-5">
              <div style="border: 2px solid #000;">
                <strong style="background-color: #000; color: white; display: inline-block; padding: 2px 20px;">
                  DESTINATÁRIO
                </strong>
                <div class="celula">
                  <span class="texto">
                    ${getCelText('desNome')}
                  </span>
                </div>
                <div class="celula">
                  <span class="texto">
                    ${getCelText('desEndereco')}
                  </span>
                </div>
                <div class="celula texto">
                  ${getCelText('desLinha2')}
                </div>
                <div class="celula texto">
                  ${getCelText('desBairro')}
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="celula">
                      <span class="texto" style="font-weight: bold; font-size: 18px; display: inline-block; margin-right: 20px;">
                        ${((order.desCep && formatCEP(order.desCep)) || '&nbsp;')}
                      </span>

                      <span class="texto">
                        ${getCelText('desCidade')} - 
                      </span>
                      <span class="texto">
                        ${getCelText('desUf')}
                      </span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          <div class="row linha">
            <div class="col-6">
              <div class="">
                <strong>REMETENTE</strong>
                <div class="celula">
                  <span class="texto">
                    ${getCelText('remNome')}
                  </span>
                </div>
                <div class="celula">
                  <span class="texto">
                    ${getCelText('remEndereco')}
                  </span>
                </div>
                <div class="celula texto">
                  ${getCelText('remLinha2')}
                </div>
                <!--<div class="celula texto">
                  ${getCelText('remBairro')}
                </div>-->
                <div class="row">
                  <div class="col-12">
                    <div class="celula">
                      <span class="texto" style="font-weight: bold; display: inline-block; margin-right: 20px;">
                        ${((order.remCep && formatCEP(order.remCep)) || '&nbsp;')}
                      </span>
                      <span class="texto">
                        ${getCelText('remCidade')} - 
                      </span>
                      <span class="texto">
                        ${getCelText('remUf')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>`)
    })
  }
}

if (!orders || !orders.length) {
  window.alert('Nenhum pedido enviado via parâmetro de URL (`?pedido`)')
}
