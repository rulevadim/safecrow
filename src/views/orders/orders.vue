<template>
  <page-layout>
    <main class="page-main page-main_orders">
      <div class="page-main__title">Ваши Сделки</div>
      <div class="orders__table-scroll">
        <div class="orders__table-wrapper">
          <table class="table table_orders">
            <thead>
              <tr>
                <th>Сделка</th>
                <th>Описание</th>
                <th>Сумма</th>
                <th>Ваша роль</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in ordersListData" :key="order.deal">
                <td>
                  <router-link class="table__id" :to="{ name: $routesNames.orderShow, params: { id: order.order_id } }">
                    № {{ ordersComputedDataMap[order.order_id].oid }}
                  </router-link>
                  <div>от {{ ordersComputedDataMap[order.order_id].readableDate }}</div>
                </td>
                <td>
                  <p class="table__description" :title="order.contract_subject">
                    {{ order.contract_subject }}
                  </p>
                </td>
                <td>
                  <div class="table__cost">{{ order.contract_cost | price }}</div>
                </td>
                <td>
                  <div class="table__role">
                    {{ ordersComputedDataMap[order.order_id].roleTitle }}
                  </div>
                </td>
                <td>
                  <router-link
                    class="table__status"
                    :to="{ name: $routesNames.orderShow, params: { id: order.order_id } }"
                  >
                    <status-comp
                      :status="ordersComputedDataMap[order.order_id].status"
                      :is-consumer="ordersComputedDataMap[order.order_id].isConsumer"
                      :is-supplier="ordersComputedDataMap[order.order_id].isSupplier"
                    />
                  </router-link>
                  <!-- <div class="orders__table__status-date">
                                        {{ order.status_date }}
                                    </div> -->
                </td>
              </tr>
              <tr v-if="!ordersListData.length">
                <td colspan="5">
                  Сделок не найдено.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </page-layout>
</template>

<script lang="ts" src="./orders.ts"></script>
<style src="./orders.css"></style>
