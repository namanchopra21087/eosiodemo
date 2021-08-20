#pragma once
#include <eosio/action.hpp>
#include <eosio/eosio.hpp>

// Generic eosio library, i.e. print, type, math, etc
using namespace eosio;

namespace tte {

// IMPORTANT: Must be the same as the --filter-name parameter's value of rodeos
static constexpr auto contract_account = "bolttech"_n;

CONTRACT ordercontrct : public contract
{
public:
    using contract::contract;
    ordercontrct(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds) {}

    // one single e-product
    TABLE product
    {
        uint16_t      id = 0;
        std::string   title;
        std::string   description;
        std::string   url;
        float         price = 0.0;

        auto primary_key() const { return id; }
        EOSLIB_SERIALIZE( product, (id)(title)(description)(url)(price))
    };

    // order
    TABLE order
    {
        uint16_t             id = 0;
        uint16_t             userid = 0;
        std::vector<uint8_t> items;
        std::string          status;
        float                total = 0.0;

        auto primary_key() const { return id; }
        EOSLIB_SERIALIZE( order, (id)(userid)(items)(status)(total))
    };

    typedef eosio::multi_index<"products"_n, product> products;
    typedef eosio::multi_index<"orders"_n, order>     orders;

    ACTION addproduct(const std::string &title, const std::string &description, const std::string &url, const float &price);

    ACTION addorder( uint16_t userid, const std::vector<uint8_t> &items, const std::string &status);

    ACTION updateorder(uint16_t id,  uint16_t userid, const std::vector<uint8_t> &items, const std::string &status);

protected:
    uint16_t addorder_impl( uint16_t                     userid,
                            const std::vector<uint8_t> & items,
                            const std::string &          status,
                            bool                         invoke_return_value );
};

EOSIO_DISPATCH(ordercontrct,(addproduct)(addorder)(updateorder))

} // namespace tte